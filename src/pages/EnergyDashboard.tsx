import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Upload, TrendingUp, Zap, DollarSign, Thermometer } from "lucide-react";

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
  const [csvInput, setCsvInput] = useState("");
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

  const handleDataImport = async () => {
    try {
      const lines = csvInput.trim().split("\n");
      const dataRows = lines.slice(1); // Skip header

      const records = dataRows.map(line => {
        const parts = line.split("\t");
        return {
          account: parts[0],
          read_date: new Date(parts[1]).toISOString().split('T')[0],
          usage: parseInt(parts[2]),
          number_of_days: parseInt(parts[3]),
          usage_per_day: parseFloat(parts[4]),
          charge: parseFloat(parts[5].replace("$", "").replace(",", "")),
          average_temperature: parseInt(parts[6]),
        };
      });

      const { error } = await supabase
        .from("energy_consumption" as any)
        .upsert(records as any, { onConflict: "account,read_date" });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Imported ${records.length} energy records`,
      });

      setCsvInput("");
      fetchData();
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        title: "Error",
        description: "Failed to import data",
        variant: "destructive",
      });
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

        {/* Data Import */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Energy Data
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Paste your tab-separated energy data below (including header row)
          </p>
          <Textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            placeholder="Account	Read Date	Usage	Number of Days	Usage per day	Charge	Average Temperature"
            rows={10}
            className="font-mono text-sm mb-4"
          />
          <Button onClick={handleDataImport} disabled={!csvInput.trim()}>
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        </Card>

        {/* R Script Integration Note */}
        <Card className="p-6 mt-6 bg-muted/50">
          <h3 className="font-semibold mb-2">🔬 SARIMA Model Integration</h3>
          <p className="text-sm text-muted-foreground mb-2">
            To add forecasts, run your R script to generate predictions, then upload the forecast JSON to update the database.
          </p>
          <p className="text-xs text-muted-foreground">
            Your R script exports to <code className="bg-background px-1 py-0.5 rounded">energy_forecast.json</code> - you can create an API endpoint to upload this data.
          </p>
        </Card>
      </div>
    </div>
  );
}
