import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Trophy, 
  Zap, 
  Star, 
  Award, 
  Target, 
  Calendar, 
  TrendingUp, 
  Package, 
  Clock, 
  Crown,
  Gift,
  Rocket,
  Shield,
  Heart,
  Users,
  Edit
} from "lucide-react";

export function ProfilePage() {
  // Mock user data
  const user = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    joinDate: "March 2024",
    totalOrders: 42,
    membershipLevel: "Gold",
    membershipTier: "Premium Explorer",
    nextTier: "Diamond Elite",
    progressToNext: 75,
    totalSavings: 2340,
    carbonOffset: 156,
    favoriteDeliveryTime: "2:30 PM"
  };

  // Monthly activity data
  const monthlyData = [
    { month: "Aug", orders: 8, savings: 120 },
    { month: "Sep", orders: 12, savings: 180 },
    { month: "Oct", orders: 15, savings: 225 },
    { month: "Nov", orders: 18, savings: 270 },
    { month: "Dec", orders: 22, savings: 330 },
    { month: "Jan", orders: 25, savings: 375 }
  ];

  // Weekly activity data
  const weeklyData = [
    { day: "Mon", deliveries: 2 },
    { day: "Tue", deliveries: 1 },
    { day: "Wed", deliveries: 4 },
    { day: "Thu", deliveries: 3 },
    { day: "Fri", deliveries: 6 },
    { day: "Sat", deliveries: 5 },
    { day: "Sun", deliveries: 2 }
  ];

  // Delivery time distribution
  const timeData = [
    { name: "Morning", value: 30, color: "#8884d8" },
    { name: "Afternoon", value: 45, color: "#82ca9d" },
    { name: "Evening", value: 25, color: "#ffc658" }
  ];

  const achievements = [
    {
      id: 1,
      title: "Speed Demon",
      description: "Complete 50 fast deliveries",
      icon: Zap,
      progress: 100,
      unlocked: true,
      date: "Dec 15, 2024"
    },
    {
      id: 2,
      title: "Eco Warrior",
      description: "Offset 100kg of carbon emissions",
      icon: Heart,
      progress: 100,
      unlocked: true,
      date: "Jan 8, 2025"
    },
    {
      id: 3,
      title: "Loyal Customer",
      description: "Complete 100 orders",
      icon: Star,
      progress: 42,
      unlocked: false,
      date: null
    },
    {
      id: 4,
      title: "Night Owl",
      description: "Order 20 evening deliveries",
      icon: Shield,
      progress: 85,
      unlocked: false,
      date: null
    },
    {
      id: 5,
      title: "Explorer",
      description: "Try 10 different delivery zones",
      icon: Rocket,
      progress: 70,
      unlocked: false,
      date: null
    },
    {
      id: 6,
      title: "Community Hero",
      description: "Refer 5 friends",
      icon: Users,
      progress: 60,
      unlocked: false,
      date: null
    }
  ];

  const membershipBenefits = [
    { title: "Priority Delivery", active: true },
    { title: "20% Faster Service", active: true },
    { title: "Premium Support", active: true },
    { title: "Exclusive Deals", active: true },
    { title: "Carbon Offset", active: false },
    { title: "VIP Events", active: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Enhanced Profile Header */}
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2">
                  <Crown className="w-4 h-4 text-yellow-800" />
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-medium">{user.name}</h1>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {user.membershipTier}
                  </Badge>
                </div>
                <p className="text-white/80">Flying with us since {user.joinDate}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-medium">{user.totalOrders}</div>
                    <div className="text-white/70">Total Orders</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-medium">${user.totalSavings}</div>
                    <div className="text-white/70">Money Saved</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-medium">{user.carbonOffset}kg</div>
                    <div className="text-white/70">CO₂ Offset</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-medium">2:30 PM</div>
                    <div className="text-white/70">Favorite Time</div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="membership" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Membership
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-medium mb-2">8 deliveries</div>
                  <div className="text-sm text-muted-foreground mb-3">+25% from last week</div>
                  <Progress value={65} className="h-2" />
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Avg. Delivery Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-medium mb-2">18 minutes</div>
                  <div className="text-sm text-muted-foreground mb-3">3 min faster than avg</div>
                  <Progress value={85} className="h-2" />
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-purple-500" />
                    Rewards Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-medium mb-2">2,450 pts</div>
                  <div className="text-sm text-muted-foreground mb-3">550 until next reward</div>
                  <Progress value={82} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest drone deliveries and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Medical supplies delivered</p>
                      <p className="text-sm text-muted-foreground">Delivered in 15 minutes • 2 hours ago</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Achievement unlocked: Eco Warrior</p>
                      <p className="text-sm text-muted-foreground">You've offset 100kg of CO₂ • 1 day ago</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">New</Badge>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                      <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Membership tier upgraded</p>
                      <p className="text-sm text-muted-foreground">Welcome to Gold tier! • 3 days ago</p>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">Milestone</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <Card key={achievement.id} className={`shadow-md transition-all hover:shadow-lg ${achievement.unlocked ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.unlocked 
                            ? 'bg-green-100 dark:bg-green-800' 
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <IconComponent className={`w-6 h-6 ${
                            achievement.unlocked 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-gray-400'
                          }`} />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{achievement.title}</h3>
                            {achievement.unlocked && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Award className="w-3 h-3 mr-1" />
                                Unlocked
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-2" />
                          </div>
                          
                          {achievement.date && (
                            <p className="text-xs text-muted-foreground">Unlocked on {achievement.date}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Orders Chart */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Monthly Orders & Savings</CardTitle>
                  <CardDescription>Your delivery activity over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                      <Bar dataKey="savings" fill="#82ca9d" name="Savings ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Deliveries by day of the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="deliveries" stroke="#8884d8" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Delivery Time Preferences */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Delivery Time Preferences</CardTitle>
                  <CardDescription>When you prefer to receive deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={timeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {timeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Activity Summary */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Activity Summary</CardTitle>
                  <CardDescription>Your delivery patterns and milestones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-medium text-blue-600">42</div>
                      <div className="text-sm text-muted-foreground">Total Orders</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-medium text-green-600">18m</div>
                      <div className="text-sm text-muted-foreground">Avg. Delivery</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-medium text-purple-600">156kg</div>
                      <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-medium text-orange-600">98%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Membership Tab */}
          <TabsContent value="membership" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Membership Status */}
              <Card className="lg:col-span-2 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    {user.membershipTier}
                  </CardTitle>
                  <CardDescription>
                    You're {user.progressToNext}% of the way to {user.nextTier}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to {user.nextTier}</span>
                      <span>{user.progressToNext}%</span>
                    </div>
                    <Progress value={user.progressToNext} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      Complete 8 more orders to unlock {user.nextTier} benefits
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                      <div className="text-2xl font-medium text-yellow-600">2,450</div>
                      <div className="text-sm text-muted-foreground">Reward Points</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                      <div className="text-2xl font-medium text-green-600">$2,340</div>
                      <div className="text-sm text-muted-foreground">Total Savings</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Your Benefits</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {membershipBenefits.map((benefit, index) => (
                        <div key={index} className={`flex items-center gap-2 p-2 rounded-lg ${
                          benefit.active 
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            benefit.active ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <span className="text-sm">{benefit.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Membership Tiers */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Membership Tiers</CardTitle>
                  <CardDescription>Unlock more benefits as you fly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Crown className="w-6 h-6 text-gray-400" />
                      <div>
                        <div className="font-medium">Silver Explorer</div>
                        <div className="text-sm text-muted-foreground">0-10 orders</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Crown className="w-6 h-6 text-yellow-500" />
                      <div>
                        <div className="font-medium text-yellow-700 dark:text-yellow-300">Gold Premium</div>
                        <div className="text-sm text-yellow-600 dark:text-yellow-400">11-50 orders (Current)</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg opacity-60">
                      <Crown className="w-6 h-6 text-blue-400" />
                      <div>
                        <div className="font-medium">Diamond Elite</div>
                        <div className="text-sm text-muted-foreground">51-100 orders</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg opacity-60">
                      <Crown className="w-6 h-6 text-purple-400" />
                      <div>
                        <div className="font-medium">Platinum Legend</div>
                        <div className="text-sm text-muted-foreground">100+ orders</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}