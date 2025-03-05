
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const About = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-medium mb-8 text-center">
              About CareerCanvas
            </h1>
            
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-2xl transform rotate-1"></div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Career Canvas Team" 
                className="rounded-2xl relative z-10 shadow-lg"
              />
            </div>
            
            <div className="prose prose-lg max-w-none">
              <h2>Our Mission</h2>
              <p>
                At CareerCanvas, we're dedicated to empowering professionals with the knowledge, strategies, and inspiration they need to thrive in today's ever-changing work landscape. Whether you're climbing the corporate ladder, building a freelance business, or developing your personal brand, our goal is to provide actionable insights that drive real results.
              </p>
              
              <h2>Our Story</h2>
              <p>
                CareerCanvas began in 2020 when a group of career advisors, freelance consultants, and personal branding experts noticed a gap in the resources available to modern professionals. While plenty of career advice existed, much of it failed to address the realities of today's digital-first, rapidly evolving workplace.
              </p>
              <p>
                We set out to create a platform that combines cutting-edge research, practical strategies, and real-world success stories to help our readers navigate their professional journeys with confidence. What started as a small blog has grown into a comprehensive resource hub serving thousands of professionals worldwide.
              </p>
              
              <h2>Our Team</h2>
              <p>
                Our diverse team brings together expertise from various professional backgrounds, including:
              </p>
              <ul>
                <li>Corporate leadership and talent development</li>
                <li>Successful freelancing across multiple industries</li>
                <li>Personal branding and online presence optimization</li>
                <li>Career coaching and transition guidance</li>
                <li>HR and recruitment insights</li>
              </ul>
              <p>
                This multidisciplinary approach allows us to provide well-rounded, practical advice that addresses the full spectrum of professional development needs.
              </p>
              
              <h2>Our Values</h2>
              <p>
                Everything we do at CareerCanvas is guided by our core values:
              </p>
              <ul>
                <li><strong>Practicality:</strong> We focus on actionable advice you can implement today.</li>
                <li><strong>Integrity:</strong> We only recommend strategies and approaches we genuinely believe in.</li>
                <li><strong>Inclusivity:</strong> We recognize and respect the diverse paths professionals take.</li>
                <li><strong>Innovation:</strong> We constantly explore new approaches to career development.</li>
                <li><strong>Community:</strong> We believe in the power of connection and shared knowledge.</li>
              </ul>
              
              <h2>Join Our Community</h2>
              <p>
                CareerCanvas is more than just a blog—it's a community of forward-thinking professionals committed to continuous growth and development. We invite you to join us by:
              </p>
              <ul>
                <li>Subscribing to our newsletter for weekly insights</li>
                <li>Following us on social media for daily inspiration</li>
                <li>Sharing your own experiences and learnings</li>
                <li>Connecting with fellow readers through comments and discussions</li>
              </ul>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/blog">
                  Explore Our Content
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
