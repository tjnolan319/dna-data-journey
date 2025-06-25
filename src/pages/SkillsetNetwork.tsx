
import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NetworkNode {
  id: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  weight: number;
}

interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

const NetworkVisualization = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Import D3 dynamically
    import('d3').then(d3 => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = 600;

      // Clear any existing SVG
      d3.select(container).selectAll("svg").remove();

      // Load data from GitHub - remove type argument and use type assertion
      d3.json("https://raw.githubusercontent.com/tjnolan319/network-visualization/main/tag_network.json")
        .then((data) => {
          const networkData = data as NetworkData;
          if (!networkData) return;

          const svg = d3
            .select(container)
            .append("svg")
            .attr("width", "100%")
            .attr("height", height)
            .style("display", "block")
            .style("background-color", "#1e293b")
            .style("border-radius", "12px");

          // Compute node degrees
          const degreeMap: { [key: string]: number } = {};
          networkData.links.forEach((link) => {
            const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
            const targetId = typeof link.target === 'string' ? link.target : link.target.id;
            degreeMap[sourceId] = (degreeMap[sourceId] || 0) + 1;
            degreeMap[targetId] = (degreeMap[targetId] || 0) + 1;
          });

          // Scale node radius based on degree
          const maxDegree = Math.max(...Object.values(degreeMap));
          const radiusScale = d3
            .scaleLinear()
            .domain([0, maxDegree])
            .range([8, 25]);

          const simulation = d3
            .forceSimulation(networkData.nodes)
            .force(
              "link",
              d3
                .forceLink(networkData.links)
                .id((d: any) => d.id)
                .distance(120)
            )
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius((d: any) => radiusScale(degreeMap[d.id] || 0) + 5));

          const link = svg
            .append("g")
            .attr("stroke", "#64748b")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(networkData.links)
            .join("line")
            .attr("stroke-width", (d: any) => Math.sqrt(d.weight) * 2);

          const node = svg
            .append("g")
            .selectAll("g")
            .data(networkData.nodes)
            .join("g")
            .attr("class", "node")
            .style("cursor", "pointer")
            .call(
              // Remove type arguments from drag function
              d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );

          node.append("circle")
            .attr("r", (d: any) => radiusScale(degreeMap[d.id] || 0))
            .attr("fill", "#f97316")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);

          node.append("text")
            .text((d: any) => d.id)
            .attr("x", 0)
            .attr("y", 4)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .style("pointer-events", "none")
            .style("user-select", "none");

          // Add hover effects
          node
            .on("mouseover", function(event, d) {
              d3.select(this).select("circle")
                .transition()
                .duration(200)
                .attr("r", (d: any) => radiusScale(degreeMap[d.id] || 0) * 1.2)
                .attr("fill", "#3b82f6");
            })
            .on("mouseout", function(event, d) {
              d3.select(this).select("circle")
                .transition()
                .duration(200)
                .attr("r", (d: any) => radiusScale(degreeMap[d.id] || 0))
                .attr("fill", "#f97316");
            });

          simulation.on("tick", () => {
            const padding = { top: 50, right: 50, bottom: 50, left: 50 };
            
            networkData.nodes.forEach((d: any) => {
              const radius = radiusScale(degreeMap[d.id] || 0);
              d.x = Math.max(padding.left + radius, Math.min(width - padding.right - radius, d.x));
              d.y = Math.max(padding.top + radius, Math.min(height - padding.bottom - radius, d.y));
            });

            link
              .attr("x1", (d: any) => d.source.x)
              .attr("y1", (d: any) => d.source.y)
              .attr("x2", (d: any) => d.target.x)
              .attr("y2", (d: any) => d.target.y);

            node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
          });

          function dragstarted(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          }

          function dragged(event: any, d: any) {
            d.fx = event.x;
            d.fy = event.y;
          }

          function dragended(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }
        })
        .catch(error => {
          console.error("Error loading network data:", error);
          // Show error message in the container
          d3.select(container)
            .append("div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("justify-content", "center")
            .style("height", "600px")
            .style("background-color", "#1e293b")
            .style("border-radius", "12px")
            .style("color", "#94a3b8")
            .text("Error loading network visualization. Please check your connection and try again.");
        });
    });
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[600px] bg-slate-800 rounded-xl overflow-hidden"
    />
  );
};

const SkillsetNetwork = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portfolio</span>
          </Button>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Interactive Skillset <span className="text-blue-600">Network Diagram</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Network visualization mapping skillsets based on GitHub project topics, with automated daily updates
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Live Network Visualization</span>
                    <Button
                      onClick={() => window.open('https://github.com/tjnolan319/network-visualization', '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <span>View on GitHub</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Hover over nodes to highlight them. Drag nodes to explore connections.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NetworkVisualization />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Objective</h4>
                    <p className="text-sm text-slate-600">
                      To create a visual representation of my skillset that automatically updates based on my GitHub project topics, making it easy for non-technical users to understand my capabilities.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">How It Works</h4>
                    <p className="text-sm text-slate-600">
                      A Python script scans my GitHub repositories daily, extracts project topics and tags, then generates a network diagram where each circle represents a skill/topic and lines connect related ones.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Key Features</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Automated daily updates</li>
                      <li>• Interactive node dragging</li>
                      <li>• Size reflects skill frequency</li>
                      <li>• Connections show relationships</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technical Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-slate-700 mb-2">Tools & Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Python', 'D3.js', 'GitHub API', 'Data Visualization', 'Automation'].map((tech) => (
                          <span key={tech} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium text-green-600">
                        Successfully bridges technical complexity with user-friendly visualization
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills Demonstrated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div>• API Integration & Data Collection</div>
                    <div>• Data Processing & Network Analysis</div>
                    <div>• Interactive Web Visualization</div>
                    <div>• Workflow Automation</div>
                    <div>• User Experience Design</div>
                    <div>• Cross-platform Development</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsetNetwork;
