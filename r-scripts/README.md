# Energy Forecasting R Scripts

This directory contains R scripts for generating SARIMA-based energy consumption forecasts.

## Setup

1. Install required R packages:
```r
install.packages(c("forecast", "tseries", "jsonlite", "httr", "lubridate"))
```

2. Update the Supabase configuration in `energy_forecast_sarima.R`:
   - Replace `YOUR_SUPABASE_ANON_KEY_HERE` with your actual Supabase anon key
   - The URL is already configured for your project

## Usage

Run the script to generate forecasts and upload them to Supabase:

```r
source("energy_forecast_sarima.R")
```

The script will:
1. Fetch historical energy data from Supabase
2. Perform exploratory analysis (stationarity tests, decomposition)
3. Build and evaluate SARIMA/SARIMAX models
4. Generate 12-month forecasts
5. Create visualization PNG files
6. Upload forecasts to Supabase (viewable on the dashboard)

## Output Files

The script generates the following visualizations:
- `energy_usage_timeseries.png` - Historical usage over time
- `energy_decomposition.png` - Seasonal decomposition
- `energy_acf_pacf.png` - Autocorrelation functions
- `energy_residuals.png` - Model residual diagnostics
- `energy_forecast.png` - Forecast visualization
- `model_info.json` - Model metrics and parameters

## Adding New Data

To add new historical data:
1. Go to Supabase Dashboard → Table Editor
2. Navigate to `energy_consumption` table
3. Insert new rows with the following columns:
   - `account`: Account number
   - `read_date`: Date of reading (YYYY-MM-DD)
   - `usage`: Energy usage in kWh
   - `number_of_days`: Billing period days
   - `usage_per_day`: Daily average
   - `charge`: Dollar amount
   - `average_temperature`: Average temp for period

After adding new data, re-run this script to update forecasts.

## Model Information

The script uses auto.arima() to automatically select the best SARIMA parameters based on AIC. It also tests whether including temperature as an external regressor improves the model and uses the better-performing version.

Typical SARIMA notation: ARIMA(p,d,q)(P,D,Q)[s]
- p,d,q: Non-seasonal AR, differencing, MA orders
- P,D,Q: Seasonal AR, differencing, MA orders
- s: Seasonal period (12 for monthly data)
