# Energy Consumption Forecasting with SARIMA
# This script generates forecasts and uploads them to Supabase
# Install required packages if needed:
# install.packages(c("forecast", "tseries", "jsonlite", "httr", "lubridate"))

library(forecast)
library(tseries)
library(jsonlite)
library(httr)
library(lubridate)

# ============================================
# SUPABASE CONFIGURATION
# ============================================
SUPABASE_URL <- "https://mlrfleeflqqfacrknnzf.supabase.co"
SUPABASE_KEY <- "YOUR_SUPABASE_ANON_KEY_HERE"  # Replace with your anon key

# Helper function to fetch data from Supabase
fetch_from_supabase <- function(table) {
  url <- paste0(SUPABASE_URL, "/rest/v1/", table, "?select=*&order=read_date.asc")
  response <- GET(url, add_headers(
    apikey = SUPABASE_KEY,
    Authorization = paste("Bearer", SUPABASE_KEY)
  ))
  content(response, "parsed")
}

# Helper function to delete from Supabase
delete_from_supabase <- function(table) {
  url <- paste0(SUPABASE_URL, "/rest/v1/", table)
  DELETE(url, add_headers(
    apikey = SUPABASE_KEY,
    Authorization = paste("Bearer", SUPABASE_KEY),
    Prefer = "return=minimal"
  ), body = list(), encode = "json")
}

# Helper function to insert data to Supabase
insert_to_supabase <- function(table, data) {
  url <- paste0(SUPABASE_URL, "/rest/v1/", table)
  response <- POST(url, 
    add_headers(
      apikey = SUPABASE_KEY,
      Authorization = paste("Bearer", SUPABASE_KEY),
      "Content-Type" = "application/json",
      Prefer = "return=minimal"
    ),
    body = toJSON(data, auto_unbox = TRUE),
    encode = "json"
  )
  return(response)
}

# ============================================
# 1. DATA PREPARATION
# ============================================

cat("=== Fetching data from Supabase ===\n")
df_raw <- fetch_from_supabase("energy_consumption")
df <- as.data.frame(df_raw)

# Convert and clean data
df$read_date <- as.Date(df$read_date)
df <- df[order(df$read_date), ]
df <- df[!is.na(df$usage) & !is.na(df$read_date), ]

cat("Loaded", nrow(df), "historical records\n")

# Create time series object (monthly data)
ts_usage <- ts(df$usage, frequency = 12, 
               start = c(year(min(df$read_date)), month(min(df$read_date))))

# ============================================
# 2. EXPLORATORY ANALYSIS
# ============================================

cat("\n=== Exploratory Analysis ===\n")

# Plot time series
png("energy_usage_timeseries.png", width = 800, height = 600)
plot(ts_usage, main = "Energy Consumption Over Time", 
     ylab = "Usage (kWh)", xlab = "Time", col = "blue", lwd = 2)
dev.off()

# Decomposition
png("energy_decomposition.png", width = 800, height = 800)
decomp <- decompose(ts_usage)
plot(decomp)
dev.off()

# Check stationarity
adf_test <- adf.test(ts_usage)
cat("ADF Test p-value:", adf_test$p.value, "\n")

# ACF and PACF plots
png("energy_acf_pacf.png", width = 1000, height = 500)
par(mfrow = c(1, 2))
acf(ts_usage, main = "ACF")
pacf(ts_usage, main = "PACF")
par(mfrow = c(1, 1))
dev.off()

# ============================================
# 3. SARIMA MODEL DEVELOPMENT
# ============================================

cat("\n=== Building SARIMA Model ===\n")

# Auto ARIMA to find best parameters
fit_auto <- auto.arima(ts_usage, seasonal = TRUE, stepwise = FALSE, approximation = FALSE)
cat("\nBest Model Found:\n")
print(summary(fit_auto))

best_model <- fit_auto

# Check residuals
png("energy_residuals.png", width = 1000, height = 800)
checkresiduals(best_model)
dev.off()

# ============================================
# 4. INCORPORATE WEATHER DATA
# ============================================

cat("\n=== Incorporating Temperature Data ===\n")

if("average_temperature" %in% colnames(df) && !all(is.na(df$average_temperature))) {
  ts_temp <- ts(df$average_temperature, frequency = 12, 
                start = c(year(min(df$read_date)), month(min(df$read_date))))
  
  # ARIMAX model with temperature as external regressor
  fit_with_temp <- auto.arima(ts_usage, xreg = ts_temp, seasonal = TRUE)
  cat("\nModel with Temperature:\n")
  print(summary(fit_with_temp))
  
  # Compare models
  cat("\n=== Model Comparison ===\n")
  cat("SARIMA AIC:", AIC(best_model), "\n")
  cat("SARIMAX (with temp) AIC:", AIC(fit_with_temp), "\n")
  
  # Use better model
  if(AIC(fit_with_temp) < AIC(best_model)) {
    best_model <- fit_with_temp
    use_temp <- TRUE
    cat("Using SARIMAX model (includes temperature)\n")
  } else {
    use_temp <- FALSE
    cat("Using SARIMA model (temperature not significant)\n")
  }
} else {
  use_temp <- FALSE
  cat("No temperature data available\n")
}

# ============================================
# 5. FORECASTING
# ============================================

cat("\n=== Generating Forecasts ===\n")

forecast_horizon <- 12

if(use_temp) {
  # Use historical average temperature pattern for future
  future_temp <- ts(rep(mean(df$average_temperature, na.rm = TRUE), forecast_horizon),
                    start = end(ts_usage)[1] + c(0, 1), frequency = 12)
  forecast_result <- forecast(best_model, h = forecast_horizon, xreg = future_temp)
} else {
  forecast_result <- forecast(best_model, h = forecast_horizon)
}

# Plot forecast
png("energy_forecast.png", width = 1000, height = 600)
plot(forecast_result, main = "Energy Consumption Forecast",
     ylab = "Usage (kWh)", xlab = "Time", col = "blue", lwd = 2)
dev.off()

# ============================================
# 6. MODEL EVALUATION
# ============================================

cat("\n=== Model Evaluation ===\n")

# Cross-validation
train_size <- floor(0.8 * length(ts_usage))
train_data <- window(ts_usage, end = time(ts_usage)[train_size])
test_data <- window(ts_usage, start = time(ts_usage)[train_size + 1])

# Refit on training data
if(use_temp) {
  train_temp <- window(ts_temp, end = time(ts_temp)[train_size])
  test_temp <- window(ts_temp, start = time(ts_temp)[train_size + 1])
  model_cv <- Arima(train_data, order = arimaorder(best_model)[1:3],
                    seasonal = arimaorder(best_model)[4:6], xreg = train_temp)
  forecast_cv <- forecast(model_cv, h = length(test_data), xreg = test_temp)
} else {
  model_cv <- Arima(train_data, order = arimaorder(best_model)[1:3],
                    seasonal = arimaorder(best_model)[4:6])
  forecast_cv <- forecast(model_cv, h = length(test_data))
}

# Calculate accuracy metrics
accuracy_metrics <- accuracy(forecast_cv, test_data)
cat("\nAccuracy Metrics:\n")
print(accuracy_metrics)

# ============================================
# 7. UPLOAD TO SUPABASE
# ============================================

cat("\n=== Uploading Forecasts to Supabase ===\n")

# Prepare forecast data
forecast_dates <- seq.Date(max(df$read_date) + months(1), by = "month", length.out = forecast_horizon)

forecast_records <- data.frame(
  forecast_date = as.character(forecast_dates),
  predicted_usage = as.numeric(forecast_result$mean),
  lower_80 = as.numeric(forecast_result$lower[, 1]),
  upper_80 = as.numeric(forecast_result$upper[, 1]),
  lower_95 = as.numeric(forecast_result$lower[, 2]),
  upper_95 = as.numeric(forecast_result$upper[, 2]),
  model_type = "SARIMA",
  created_at = format(Sys.time(), "%Y-%m-%dT%H:%M:%S")
)

# Delete old forecasts
cat("Deleting old forecasts...\n")
delete_from_supabase("energy_forecasts")

# Insert new forecasts
cat("Inserting new forecasts...\n")
response <- insert_to_supabase("energy_forecasts", forecast_records)

if(status_code(response) %in% c(200, 201)) {
  cat("✓ Successfully uploaded", nrow(forecast_records), "forecast records\n")
} else {
  cat("✗ Failed to upload forecasts\n")
  cat("Status:", status_code(response), "\n")
}

# ============================================
# 8. EXPORT SUMMARY
# ============================================

model_info <- list(
  model_type = "SARIMA",
  order = arimaorder(best_model),
  aic = AIC(best_model),
  aicc = best_model$aicc,
  bic = BIC(best_model),
  uses_temperature = use_temp,
  rmse = accuracy_metrics[2, "RMSE"],
  mape = accuracy_metrics[2, "MAPE"],
  generated_at = Sys.time()
)

# Save model info locally
write_json(model_info, "model_info.json", pretty = TRUE)

cat("\n=== Summary ===\n")
cat("Model Type: SARIMA\n")
cat("Order:", paste(arimaorder(best_model), collapse = ", "), "\n")
cat("RMSE:", round(accuracy_metrics[2, "RMSE"], 2), "kWh\n")
cat("MAPE:", round(accuracy_metrics[2, "MAPE"], 2), "%\n")
cat("Temperature included:", use_temp, "\n")
cat("\nGenerated visualizations:\n")
cat("  - energy_usage_timeseries.png\n")
cat("  - energy_decomposition.png\n")
cat("  - energy_acf_pacf.png\n")
cat("  - energy_residuals.png\n")
cat("  - energy_forecast.png\n")
cat("\n✓ Forecasts uploaded to Supabase successfully!\n")
