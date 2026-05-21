"use client";

import { motion } from "framer-motion";
import { useStudyStore } from "@/lib/store";
import {
  BookOpen,
  ExternalLink,
  Video,
  FileText,
  Globe,
  Search,
  BookMarked,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { Input, Badge, Card } from "@/components/ui/common";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "video" | "article" | "website" | "book";
  url: string;
  subject: string;
  free: boolean;
}

const RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Khan Academy",
    description: "Free world-class education for anyone, anywhere. Comprehensive courses for all subjects.",
    type: "website",
    url: "https://www.khanacademy.org",
    subject: "All",
    free: true,
  },
  {
    id: "2",
    title: "NCERT Solutions",
    description: "Official NCERT textbook solutions for all classes and subjects.",
    type: "website",
    url: "https://ncert.nic.in",
    subject: "All",
    free: true,
  },
  {
    id: "3",
    title: "Physics Wallah",
    description: "Popular YouTube channel and platform for Physics, Chemistry, and Math.",
    type: "video",
    url: "https://www.youtube.com/c/PhysicsWallah",
    subject: "Science",
    free: true,
  },
  {
    id: "4",
    title: "Mathongo",
    description: "JEE and board exam preparation with detailed video solutions.",
    type: "website",
    url: "https://www.mathongo.com",
    subject: "Mathematics",
    free: false,
  },
  {
    id: "5",
    title: "Vedantu",
    description: "Live online tutoring platform with expert teachers.",
    type: "website",
    url: "https://www.vedantu.com",
    subject: "All",
    free: false,
  },
  {
    id: "6",
    title: "Toppr",
    description: "Adaptive learning platform with practice questions and tests.",
    type: "website",
    url: "https://www.toppr.com",
    subject: "All",
    free: false,
  },
  {
    id: "7",
    title: "Organic Chemistry Tutor",
    description: "YouTube channel with clear explanations for Math and Science.",
    type: "video",
    url: "https://www.youtube.com/@TheOrganicChemistryTutor",
    subject: "Science",
    free: true,
  },
  {
    id: "8",
    title: "Embibe",
    description: "AI-powered learning platform with personalized study plans.",
    type: "website",
    url: "https://www.embibe.com",
    subject: "All",
    free: true,
  },
];

export function ResourcesSection() {
  const { subject } = useStudyStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");

  const filteredResources = RESOURCES.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || resource.type === filterType;
    const matchesSubject =
      filterSubject === "all" ||
      resource.subject === "All" ||
      resource.subject === filterSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5" />;
      case "article":
        return <FileText className="w-5 h-5" />;
      case "book":
        return <BookMarked className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "text-red-500 bg-red-500/10";
      case "article":
        return "text-blue-500 bg-blue-500/10";
      case "book":
        return "text-purple-500 bg-purple-500/10";
      default:
        return "text-green-500 bg-green-500/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Study Resources</h2>
            <p className="text-muted-foreground">
              Curated learning materials to boost your preparation
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="video">Videos</option>
            <option value="website">Websites</option>
            <option value="article">Articles</option>
            <option value="book">Books</option>
          </select>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Social Science">Social Science</option>
          </select>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Video, label: "Videos", count: RESOURCES.filter((r) => r.type === "video").length },
          { icon: Globe, label: "Websites", count: RESOURCES.filter((r) => r.type === "website").length },
          { icon: FileText, label: "Articles", count: RESOURCES.filter((r) => r.type === "article").length },
          { icon: GraduationCap, label: "Free", count: RESOURCES.filter((r) => r.free).length },
        ].map((item, index) => (
          <div
            key={item.label}
            className="glass-card p-4 rounded-xl text-center cursor-pointer hover:border-primary/50 transition-all"
            onClick={() => {
              if (item.label === "Free") {
                // Filter free resources
              } else {
                setFilterType(item.label.toLowerCase());
              }
            }}
          >
            <item.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="font-medium">{item.label}</p>
            <p className="text-sm text-muted-foreground">{item.count} resources</p>
          </div>
        ))}
      </motion.div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredResources.map((resource, index) => (
          <motion.a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="glass-card p-4 rounded-xl hover:border-primary/50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${getTypeColor(resource.type)}`}>
                {getTypeIcon(resource.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{resource.title}</h3>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {resource.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant={resource.free ? "success" : "default"}>
                    {resource.free ? "Free" : "Paid"}
                  </Badge>
                  <Badge>{resource.subject}</Badge>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 rounded-xl text-center"
        >
          <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Resources Found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
}
