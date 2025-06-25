
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const GenreCategoryProject = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-8 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </Button>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Genre-Category Pair Advantages at the Academy Awards
            </h1>
            <p className="text-xl text-slate-600 mb-6">
              Python Coding in Deepnote for Data Science
            </p>
            <p className="text-lg text-slate-700">
              Analyzed 4,000+ Oscar-winning films to uncover which genre-category pairings offer the best strategic advantage for production companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Year</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">2025</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">4 Weeks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Role</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Data Analyst</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Tim Nolan, Katherine Avendano, Mike Wang</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tools Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Python", "Deepnote", "Pandas", "Seaborn", "Chi-Square Test", "Phi Coefficient"].map((tool) => (
                  <span key={tool} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {tool}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex space-x-4">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Github className="h-4 w-4" />
                  <span>View on GitHub</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objective</CardTitle>
            </CardHeader>
            <CardContent>
              <p>To determine how a film's genre influences its probability of winning an Oscar, and whether this effect varies by award category, using statistical analysis and data visualization.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">▪</span>
                  Merged and cleaned data from IMDb and Kaggle's Oscar Awards dataset, resulting in a 4,000+ record dataset covering films from 1990–2024
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">▪</span>
                  Performed Chi-Square tests and calculated phi coefficients to identify statistically significant genre-category combinations
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">▪</span>
                  Built a series of data visualizations including heatmaps, bar charts, and multi-panel comparisons to highlight strategic genre-category advantages
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p><strong>Genre matters:</strong> Specific genres consistently outperform others in certain Oscar categories</p>
                <div>
                  <p className="font-semibold mb-2">Top high-impact pairings include:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Westerns for Directing</li>
                    <li>• Sports and Adventure for Documentary Feature</li>
                  </ul>
                </div>
                <p>Some genres (like Drama and Music) saw success in unexpected categories, offering overlooked strategic opportunities</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visual Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Figure 1: Win Probability Advantage by Genre-Category Combinations</h4>
                  <p className="text-sm text-slate-600">Heatmap showing the increased probability of winning an Oscar for specific genre-category pairs. Lighter shades indicate greater win advantage; asterisks denote statistical significance (* p&lt;0.05, ** p&lt;0.01, *** p&lt;0.001).</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Figure 2: Top Genre-Category Combinations Ranked by Effect Size</h4>
                  <p className="text-sm text-slate-600">Bar chart ranking genre-category pairs by statistical strength (phi coefficient). Higher bars indicate stronger-than-expected relationships between genre and Oscar wins.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Figure 3: Nomination Distribution and Win Significance for Top 6 Genres</h4>
                  <p className="text-sm text-slate-600">Multi-panel plot showing nomination counts and significant win relationships for six top genres. Orange highlights denote statistically significant genre-category combinations with elevated win rates.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills Demonstrated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Core Skills:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Dataset merging and validation</li>
                    <li>• Chi-Square statistical testing, effect size analysis (phi)</li>
                    <li>• Data visualization using Seaborn and Matplotlib</li>
                    <li>• Business case framing and strategic recommendations</li>
                    <li>• Collaboration and written presentation of findings</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technical Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "Data Science Notebooks (Deepnote)", "Data Visualization", "Statistical testing in Python", "Chi Square", "Phi Coefficient", "Communication Skills", "Business Intelligence", "Merging Datasets", "Large Datasets", "Python Visualization Libraries"].map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenreCategoryProject;
