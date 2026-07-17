import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const metadata = { title: "Profile | ApplyGenie" };

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your professional profile and resume details.</p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="skills">Summary & Skills</TabsTrigger>
        </TabsList>
        
        {/* Basic Info Tab */}
        <TabsContent value="basic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your personal details. This information will be used to auto-fill applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="San Francisco, CA" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                  <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/johndoe" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="portfolio">Portfolio / Website</Label>
                  <Input id="portfolio" type="url" placeholder="https://johndoe.com" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>
                Add your educational background.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4 space-y-4 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>School / University</Label>
                    <Input defaultValue="University of California, Berkeley" />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input defaultValue="Bachelor of Science" />
                  </div>
                  <div className="space-y-2">
                    <Label>Field of Study</Label>
                    <Input defaultValue="Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="month" defaultValue="2016-08" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="month" defaultValue="2020-05" />
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                + Add Education
              </Button>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Employment Tab */}
        <TabsContent value="employment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Employment History</CardTitle>
              <CardDescription>
                Detail your previous work experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4 space-y-4 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Company Name</Label>
                    <Input defaultValue="Acme Corp" />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input defaultValue="Software Engineer" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input defaultValue="San Francisco, CA" />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="month" defaultValue="2020-06" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="month" placeholder="Present" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea 
                      className="min-h-[100px]" 
                      defaultValue="• Developed and maintained RESTful APIs using Node.js and Express.&#10;• Reduced database query times by 40% through indexing optimization." 
                    />
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                + Add Employment
              </Button>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary & Skills</CardTitle>
              <CardDescription>
                Highlight your key qualifications and professional summary.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Professional Summary</Label>
                <Textarea 
                  className="min-h-[120px]" 
                  placeholder="Write a brief summary of your professional background..." 
                  defaultValue="Passionate Software Engineer with 4+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud infrastructure. Adept at collaborating with cross-functional teams to deliver high-quality software solutions."
                />
              </div>
              <div className="space-y-2">
                <Label>Core Skills (comma separated)</Label>
                <Textarea 
                  className="min-h-[80px]" 
                  placeholder="JavaScript, React, Node.js, Python, AWS..." 
                  defaultValue="JavaScript, TypeScript, React, Next.js, Node.js, Express, PostgreSQL, AWS, Docker"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
