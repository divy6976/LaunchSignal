import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Heart, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap,
  Clock,
  UserCircle
} from 'lucide-react';
import { startupAPI } from '../services/api';

const StartupAnalytics = ({ startupId, startupName }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  useEffect(() => {
    if (startupId) {
      fetchAnalytics();
    }
  }, [startupId, timeRange]);

  // Load feedback for this startup
  useEffect(() => {
    const loadFeedback = async () => {
      if (!startupId) return;
      try {
        setLoadingFeedback(true);
        const fb = await startupAPI.getFeedbackForStartup(startupId);
        if (Array.isArray(fb)) {
          setFeedbackItems(
            fb
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(item => ({
                id: item._id,
                content: item.comment || item.content || '',
                author: item.userId?.fullName || 'Anonymous',
                createdAt: item.createdAt || new Date().toISOString(),
              }))
          );
        } else {
          setFeedbackItems([]);
        }
      } catch (_) {
        setFeedbackItems([]);
      } finally {
        setLoadingFeedback(false);
      }
    };
    loadFeedback();
  }, [startupId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Try to fetch real analytics data from API
      try {
        const realAnalytics = await startupAPI.getStartupAnalytics(startupId);
        setAnalytics(realAnalytics);
      } catch (apiError) {
        console.warn('API analytics not available, using mock data:', apiError);
        // Fallback to mock data if API fails
        const mockAnalytics = generateMockAnalytics(startupId, timeRange);
        setAnalytics(mockAnalytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to mock data on any error
      const mockAnalytics = generateMockAnalytics(startupId, timeRange);
      setAnalytics(mockAnalytics);
    } finally {
      setLoading(false);
    }
  };

  // Mock data generator - this will be replaced with real API call
  const generateMockAnalytics = (id, range) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const now = new Date();
    
    // Generate daily data
    const dailyData = Array.from({ length: days }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 50) + 10,
        upvotes: Math.floor(Math.random() * 15) + 2,
        feedback: Math.floor(Math.random() * 8) + 1,
        shares: Math.floor(Math.random() * 5) + 1,
      };
    });

    // Generate hourly data for today
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      views: Math.floor(Math.random() * 20) + 1,
      upvotes: Math.floor(Math.random() * 5),
    }));

    // Generate demographic data
    const demographicData = [
      { name: '18-24', value: 25, color: '#8884d8' },
      { name: '25-34', value: 35, color: '#82ca9d' },
      { name: '35-44', value: 20, color: '#ffc658' },
      { name: '45-54', value: 15, color: '#ff7300' },
      { name: '55+', value: 5, color: '#00ff00' },
    ];

    // Generate traffic sources
    const trafficSources = [
      { name: 'Direct', value: 40, color: '#8884d8' },
      { name: 'Social Media', value: 30, color: '#82ca9d' },
      { name: 'Search', value: 20, color: '#ffc658' },
      { name: 'Referral', value: 10, color: '#ff7300' },
    ];

    const totalViews = dailyData.reduce((sum, day) => sum + day.views, 0);
    const totalUpvotes = dailyData.reduce((sum, day) => sum + day.upvotes, 0);
    const totalFeedback = dailyData.reduce((sum, day) => sum + day.feedback, 0);
    const totalShares = dailyData.reduce((sum, day) => sum + day.shares, 0);

    return {
      overview: {
        totalViews,
        totalUpvotes,
        totalFeedback,
        totalShares,
        engagementRate: Math.round((totalUpvotes / totalViews) * 100) || 0,
        feedbackRate: Math.round((totalFeedback / totalViews) * 100) || 0,
        avgViewsPerDay: Math.round(totalViews / days),
        growthRate: Math.floor(Math.random() * 50) - 10, // -10% to +40%
      },
      dailyData,
      hourlyData,
      demographicData,
      trafficSources,
      topPerformers: [
        { metric: 'Peak View Day', value: Math.max(...dailyData.map(d => d.views)), date: dailyData.find(d => d.views === Math.max(...dailyData.map(d => d.views)))?.date },
        { metric: 'Best Engagement', value: Math.max(...dailyData.map(d => d.upvotes)), date: dailyData.find(d => d.upvotes === Math.max(...dailyData.map(d => d.upvotes)))?.date },
        { metric: 'Most Feedback', value: Math.max(...dailyData.map(d => d.feedback)), date: dailyData.find(d => d.feedback === Math.max(...dailyData.map(d => d.feedback)))?.date },
      ],
      recentActivity: [
        { type: 'view', user: 'Anonymous User', time: '2 minutes ago' },
        { type: 'upvote', user: 'Sarah Johnson', time: '5 minutes ago' },
        { type: 'feedback', user: 'Mike Chen', time: '12 minutes ago' },
        { type: 'share', user: 'Alex Rodriguez', time: '1 hour ago' },
        { type: 'view', user: 'Anonymous User', time: '1 hour ago' },
      ]
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-8 text-gray-500">
        No analytics data available
      </div>
    );
  }

  const { overview, dailyData, hourlyData, demographicData, trafficSources, topPerformers, recentActivity } = analytics;

  return (
    <div className="space-y-6">
      {/* Enhanced header */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Analytics — {startupName}</h2>
            <p className="text-sm text-gray-600 mt-1">Deep insights into performance, engagement, and feedback</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Cards with richer styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-blue-600">{overview.totalViews.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {overview.growthRate >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${overview.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.abs(overview.growthRate)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-white border-rose-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upvotes</p>
                <p className="text-2xl font-bold text-red-600">{overview.totalUpvotes.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {overview.engagementRate}% engagement rate
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Feedback</p>
                <p className="text-2xl font-bold text-orange-600">{overview.totalFeedback.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {overview.feedbackRate}% feedback rate
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Daily Views</p>
                <p className="text-2xl font-bold text-green-600">{overview.avgViewsPerDay.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Last {timeRange}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Charts Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Daily Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="upvotes" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Hourly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="upvotes" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topPerformers.map((performer, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{performer.metric}</p>
                      <p className="text-2xl font-bold text-gray-900">{performer.value}</p>
                      <p className="text-sm text-gray-500">{performer.date}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="upvotes" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="feedback" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{overview.engagementRate}%</div>
                  <div className="text-sm text-gray-600">Engagement Rate</div>
                  <div className="text-xs text-green-600 mt-1">↑ 5% from last week</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">{overview.feedbackRate}%</div>
                  <div className="text-sm text-gray-600">Feedback Rate</div>
                  <div className="text-xs text-green-600 mt-1">↑ 3% from last week</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">{overview.avgViewsPerDay}</div>
                  <div className="text-sm text-gray-600">Avg Daily Views</div>
                  <div className="text-xs text-green-600 mt-1">↑ 8% from last week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFeedback ? (
                <div className="text-gray-500">Loading feedback...</div>
              ) : feedbackItems.length === 0 ? (
                <div className="text-gray-500">No feedback yet.</div>
              ) : (
                <div className="space-y-4">
                  {feedbackItems.map((fb) => (
                    <div key={fb.id} className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                      <div className="p-2 bg-blue-100 rounded-full"><UserCircle className="h-5 w-5 text-blue-700" /></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">{fb.author}</p>
                          <span className="text-xs text-gray-500">{new Date(fb.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{fb.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'view' ? 'bg-blue-100' :
                      activity.type === 'upvote' ? 'bg-red-100' :
                      activity.type === 'feedback' ? 'bg-orange-100' :
                      'bg-green-100'
                    }`}>
                      {activity.type === 'view' && <Eye className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'upvote' && <Heart className="h-4 w-4 text-red-600" />}
                      {activity.type === 'feedback' && <MessageSquare className="h-4 w-4 text-orange-600" />}
                      {activity.type === 'share' && <Users className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user} {activity.type === 'view' ? 'viewed' : 
                                        activity.type === 'upvote' ? 'upvoted' :
                                        activity.type === 'feedback' ? 'left feedback on' :
                                        'shared'} your startup
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StartupAnalytics;
