import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Zap, DollarSign, Thermometer } from "lucide-react";

interface EnergyData {
  read_date: string;
  usage: number;
  charge: number;
  average_temperature: number;
  usage_per_day: number;
}

interface ForecastData {
  forecast_date: string;
  forecast_usage: number;
  lower_80: number;
  upper_80: number;
  lower_95: number;
  upper_95: number;
}

export default function EnergyDashboard() {
  const [historicalData, setHistoricalData] = useState<EnergyData[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: historical, error: histError } = await supabase
        .from("energy_consumption" as any)
        .select("*")
        .order("read_date", { ascending: true });

      if (histError) throw histError;

      const { data: forecasts, error: foreError } = await supabase
        .from("energy_forecasts" as any)
        .select("*")
        .order("forecast_date", { ascending: true });

      if (foreError) throw foreError;

      setHistoricalData((historical as any) || []);
      setForecastData((forecasts as any) || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load energy data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const combinedChartData = [
    ...historicalData.map(d => ({
      date: d.read_date,
      actual: d.usage,
      type: "historical"
    })),
    ...forecastData.map(f => ({
      date: f.forecast_date,
      forecast: f.forecast_usage,
      lower80: f.lower_80,
      upper80: f.upper_80,
      type: "forecast"
    }))
  ];

  const stats = {
    avgUsage: historicalData.length > 0 
      ? (historicalData.reduce((sum, d) => sum + d.usage, 0) / historicalData.length).toFixed(1)
      : "0",
    totalCharge: historicalData.reduce((sum, d) => sum + d.charge, 0).toFixed(2),
    avgTemp: historicalData.length > 0
      ? (historicalData.reduce((sum, d) => sum + (d.average_temperature || 0), 0) / historicalData.length).toFixed(1)
      : "0",
    avgDailyUsage: historicalData.length > 0
      ? (historicalData.reduce((sum, d) => sum + d.usage_per_day, 0) / historicalData.length).toFixed(2)
      : "0"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading energy data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Energy Consumption Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your energy usage and forecast future consumption
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Monthly Usage</p>
                <p className="text-2xl font-bold">{stats.avgUsage} kWh</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Daily Usage</p>
                <p className="text-2xl font-bold">{stats.avgDailyUsage} kWh</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Charges</p>
                <p className="text-2xl font-bold">${stats.totalCharge}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Thermometer className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Temperature</p>
                <p className="text-2xl font-bold">{stats.avgTemp}°F</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Usage Trends & Forecast</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={combinedChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Area type="monotone" dataKey="actual" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Actual Usage" />
                <Area type="monotone" dataKey="forecast" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.4} name="Forecast" />
                <Area type="monotone" dataKey="upper80" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.2} name="Upper 80%" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Temperature vs Usage</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="read_date" 
                  className="text-xs"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                />
                <YAxis yAxisId="left" className="text-xs" />
                <YAxis yAxisId="right" orientation="right" className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="usage" stroke="hsl(var(--primary))" name="Usage (kWh)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="average_temperature" stroke="hsl(var(--chart-1))" name="Temp (°F)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Model Information */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h2 className="text-xl font-semibold mb-4">🔬 SARIMA Forecasting Model</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Forecasts are generated using a <strong>SARIMA (Seasonal AutoRegressive Integrated Moving Average)</strong> model 
              that analyzes historical usage patterns and temperature data to predict future energy consumption.
            </p>
            
            <div className="bg-background/50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-sm">How It Works:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Analyzes seasonal patterns in your energy usage</li>
                <li>Incorporates temperature correlation for improved accuracy</li>
                <li>Generates 12-month forecasts with confidence intervals</li>
                <li>Auto-selects optimal model parameters using AIC criteria</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-sm">Update Forecasts:</h3>
              <p className="text-sm text-muted-foreground">
                To refresh predictions, run the R script located in <code className="bg-background px-1.5 py-0.5 rounded text-xs">r-scripts/energy_forecast_sarima.R</code>.
                The script will automatically:
              </p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside ml-2">
                <li>Fetch current data from the database</li>
                <li>Train the SARIMA model</li>
                <li>Generate visualizations (PNG files)</li>
                <li>Upload new forecasts to display here</li>
              </ol>
            </div>

            <p className="text-xs text-muted-foreground italic">
              Data management is handled through the backend. Add new historical data via Supabase Table Editor.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
