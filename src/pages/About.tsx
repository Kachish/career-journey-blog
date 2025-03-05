
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen, Briefcase, Heart, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

import Layout from "@/components/Layout";
import NewsletterSignup from "@/components/NewsletterSignup";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const team = [
    {
      name: "Emma Rodriguez",
      role: "Founder & Editor-in-Chief",
      bio: "Career development specialist with 10+ years of experience in helping professionals reach their full potential.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "David Chen",
      role: "Senior Writer, Freelancing",
      bio: "Successful freelancer and educator who has helped hundreds of professionals build thriving freelance businesses.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Sarah Johnson",
      role: "Personal Branding Specialist",
      bio: "Brand strategist who has worked with Fortune 500 executives and entrepreneurs to develop authentic personal brands.",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    }
  ];

  const values = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Excellence",
      description: "We're committed to providing the highest quality content and insights to help professionals succeed."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community",
      description: "We believe in fostering a supportive community where professionals can learn from each other."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Authenticity",
      description: "We value genuine expression and believe that professional success should align with personal values."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Continuous Learning",
      description: "We embrace a growth mindset and are dedicated to ongoing professional development."
    }
  ];

  return (
    <Layout>
      {/* About Header */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-display font-medium mb-6">
            About CareerCanvas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our mission is to empower professionals with the knowledge, strategies, and inspiration to build fulfilling careers and authentic personal brands.
          </p>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl transform -rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Our team collaborating" 
                className="rounded-2xl relative z-10 shadow-lg"
              />
            </div>
            <div>
              <span className="inline-block px-4 py-1 mb-4 text-sm font-medium rounded-full bg-secondary text-primary">
                Our Story
              </span>
              <h2 className="text-3xl font-display font-medium mb-4">
                A Community for Growth-Minded Professionals
              </h2>
              <p className="text-muted-foreground mb-4">
                CareerCanvas was founded in 2020 with a simple vision: to create a platform where professionals could find authentic, practical guidance for navigating their career journeys.
              </p>
              <p className="text-muted-foreground mb-4">
                What began as a small blog has grown into a thriving community of career-focused individuals who are committed to continuous growth, meaningful work, and authentic self-expression in the professional sphere.
              </p>
              <p className="text-muted-foreground">
                Today, our team of experienced writers and career specialists delivers insights on everything from career advancement strategies to freelancing tips and personal branding techniques.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-12 md:py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-medium rounded-full bg-secondary text-primary">
            Our Values
          </span>
          <h2 className="text-3xl font-display font-medium mb-6">
            What Guides Our Work
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            At CareerCanvas, our values shape everything we do, from the content we create to the community we build.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl border border-border transition-all hover:shadow-md"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: "fade-in 0.6s ease-out both" 
                }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-display font-medium mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-medium rounded-full bg-secondary text-primary">
            Our Team
          </span>
          <h2 className="text-3xl font-display font-medium mb-6">
            Meet the Experts Behind CareerCanvas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Our diverse team of writers, career specialists, and industry experts brings a wealth of knowledge and experience to every article.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl border border-border transition-all hover:shadow-md flex flex-col items-center"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: "fade-in 0.6s ease-out both" 
                }}
              >
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mb-4"
                />
                <h3 className="text-xl font-display font-medium mb-1">{member.name}</h3>
                <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 md:py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-display font-medium mb-6">
            Join Our Community
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with a network of professionals who are committed to growth, learning, and meaningful careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/blog">
                Read Our Articles
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <NewsletterSignup />
        </div>
      </section>
    </Layout>
  );
};

export default About;
