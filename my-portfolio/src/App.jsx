import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as LucideIcons from 'lucide-react';

// Animation & 3D Libraries
// We assume Three.js and Framer Motion are available via window if this were a raw HTML file,
// but for this React environment, we will use standard CSS animations and pure JS for the 3D canvas
// to ensure zero dependency breakage in the previewer.

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Resume Data based on uploaded PDF
  const resumeData = {
    name: "Hashim Ali",
    title: "Deputy Manager - Academic & Operations",
    subtitle: "EdTech & Hospitality Professional",
    location: "Jaipur, Rajasthan, India",
    summary: "Driving academic excellence & smooth campus operations. Experienced in end-to-end academic operations, business management, and faculty coordination across the EdTech and Hospitality sectors.",
    contact: {
      phone: "9166177602",
      email: "hashimali1410@gmail.com",
      linkedin: "https://www.linkedin.com/in/hashim-ali-636080247"
    },
    experience: [
      {
        company: "CollegeDekho",
        role: "Deputy Manager (Academic & Operations)",
        period: "Oct 2025 - Present",
        location: "Jaipur",
        description: "Leading end-to-end academic operations. Planning campus operations, designing timetables, and ensuring resource allocation aligns with business goals. Coordinating faculty and students for smooth delivery of academic services."
      },
      {
        company: "CollegeDekho",
        role: "Assistant Manager",
        period: "May 2024 - Sep 2025",
        location: "Jaipur",
        description: "Managed academic schedules, faculty support, and student grievances. Organized special training sessions and FDPs. Leveraged EdTech tools for data management."
      },
      {
        company: "Sunstone",
        role: "Campus Manager",
        period: "Dec 2020 - Apr 2024",
        location: "Jaipur",
        description: "Oversaw operations at JECRC University and Suresh Gyan Vihar University. Managed faculty coordination, support services, and end-to-end student issue resolution (85% resolved within 24hrs) for 1,100+ students."
      },
      {
        company: "OYO",
        role: "Hotel Manager",
        period: "Apr 2018 - Nov 2020",
        location: "Jaipur",
        description: "Oversaw daily operations across 10 OYO properties. Managed booking efficiency, room inventory, and guest satisfaction to drive revenue growth."
      }
    ],
    skills: [
      "Academic Administration",
      "Operational Planning",
      "Business Management",
      "Faculty Coordination",
      "Student Engagement",
      "Data Management",
      "CRM & EdTech Tools",
      "Team Leadership",
      "Hospitality Management"
    ]
  };

  // --- 3D Background Effect (Canvas) ---
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Particles representing nodes/operations
    const particles = [];
    const particleCount = 70; // Number of nodes
    const connectionDistance = 150;
    const mouseDistance = 200;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1; // Velocity
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2 + 1;
        this.color = `rgba(100, 255, 218, ${Math.random() * 0.5 + 0.2})`; // Cyan/Teal
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach((p, index) => {
        p.update();
        p.draw();

        // Connect particles to each other
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 255, 218, ${1 - dist / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect particles to mouse
        const mouseDx = p.x - mousePos.x;
        const mouseDy = p.y - mousePos.y;
        const mDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        if (mDist < mouseDistance) {
            // Slight attraction to mouse
            p.x -= mouseDx * 0.01;
            p.y -= mouseDy * 0.01;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - mDist / mouseDistance})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mousePos]);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // --- Icons ---
  const { Phone, Mail, MapPin, Linkedin, Briefcase, GraduationCap, Award, ExternalLink, ChevronDown, MessageCircle } = LucideIcons;

  return (
    <div 
      className="relative min-h-screen text-slate-200 font-sans overflow-x-hidden bg-slate-900 selection:bg-teal-400 selection:text-slate-900"
      onMouseMove={handleMouseMove}
    >
      {/* 3D Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40"
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter text-teal-400">HA.</div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            {['Home', 'Experience', 'Skills', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="hover:text-teal-400 transition-colors uppercase tracking-widest text-xs"
              >
                {item}
              </button>
            ))}
          </div>
          <a 
            href={`https://wa.me/${resumeData.contact.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg shadow-green-500/20"
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section id="home" className="min-h-screen flex flex-col justify-center items-center px-6 pt-16">
          <div className="max-w-4xl w-full">
            <div className="animate-fade-in-up">
              <h2 className="text-teal-400 tracking-widest uppercase font-bold text-sm mb-4">Portfolio & Resume</h2>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-100 mb-6 leading-tight">
                {resumeData.name}
              </h1>
              <h3 className="text-2xl md:text-3xl text-slate-400 mb-8 font-light">
                {resumeData.title}
              </h3>
              <p className="text-slate-400 max-w-2xl text-lg leading-relaxed mb-10">
                {resumeData.summary}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                   href={`mailto:${resumeData.contact.email}`}
                   className="px-8 py-3 border border-teal-400 text-teal-400 rounded hover:bg-teal-400/10 transition-colors font-medium flex items-center gap-2"
                >
                  <Mail size={18} /> Contact Me
                </a>
                <a 
                   href={resumeData.contact.linkedin}
                   target="_blank"
                   rel="noreferrer"
                   className="px-8 py-3 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors font-medium flex items-center gap-2 border border-slate-700"
                >
                  <Linkedin size={18} /> LinkedIn
                </a>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => scrollToSection('experience')}
            className="absolute bottom-10 animate-bounce text-slate-500 hover:text-teal-400 transition-colors"
          >
            <ChevronDown size={32} />
          </button>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="min-h-screen py-24 px-6 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-16">
              <span className="text-teal-400 font-bold text-xl">01.</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Professional Experience</h2>
              <div className="h-[1px] bg-slate-700 flex-grow max-w-xs ml-4"></div>
            </div>

            <div className="space-y-12 border-l border-slate-700 ml-4 md:ml-0 pl-8 md:pl-0">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="relative md:ml-12 group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[41px] md:-left-[53px] top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-teal-400 group-hover:bg-teal-400 transition-colors shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
                  
                  {/* Card */}
                  <div className="bg-slate-800/40 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-slate-700/50 hover:border-teal-400/30 transition-all hover:shadow-2xl hover:shadow-teal-900/20 transform hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-100">{exp.role}</h3>
                        <div className="text-teal-400 font-medium flex items-center gap-2 mt-1">
                          <Briefcase size={16} /> {exp.company}
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm font-mono bg-slate-800 px-3 py-1 rounded border border-slate-700 whitespace-nowrap">
                        {exp.period}
                      </span>
                    </div>
                    
                    <p className="text-slate-400 leading-relaxed mb-4">
                      {exp.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-slate-500 gap-2">
                      <MapPin size={14} /> {exp.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
             <div className="flex items-center gap-4 mb-16">
              <span className="text-teal-400 font-bold text-xl">02.</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Core Competencies</h2>
              <div className="h-[1px] bg-slate-700 flex-grow max-w-xs ml-4"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {resumeData.skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="bg-slate-800/30 backdrop-blur-sm p-4 rounded border border-slate-700/50 hover:bg-slate-800/60 hover:border-teal-400/50 transition-all flex items-center gap-3 group"
                >
                  <div className="text-teal-400 group-hover:scale-110 transition-transform">
                    <Award size={20} />
                  </div>
                  <span className="text-slate-300 font-medium">{skill}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-16 p-8 bg-gradient-to-r from-teal-900/20 to-slate-900 rounded-2xl border border-teal-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">Want to work together?</h3>
                    <p className="text-slate-400">I am currently available for new opportunities in Academic & Operations management.</p>
                </div>
                <a 
                   href={`https://wa.me/91${resumeData.contact.phone}`}
                   className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg shadow-green-900/20 flex items-center gap-3 whitespace-nowrap"
                >
                   <MessageCircle size={20} />
                   Chat on WhatsApp
                </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section id="contact" className="py-12 bg-slate-950 border-t border-slate-800 text-center">
            <h2 className="text-2xl font-bold text-slate-200 mb-8">Get In Touch</h2>
            <div className="flex justify-center gap-8 mb-8">
                 <a href={`mailto:${resumeData.contact.email}`} className="text-slate-400 hover:text-teal-400 transition-colors flex flex-col items-center gap-2 group">
                     <div className="p-4 bg-slate-900 rounded-full group-hover:bg-teal-400/10 transition-colors">
                        <Mail size={24} />
                     </div>
                     <span className="text-sm">Email</span>
                 </a>
                 <a href={`tel:${resumeData.contact.phone}`} className="text-slate-400 hover:text-teal-400 transition-colors flex flex-col items-center gap-2 group">
                     <div className="p-4 bg-slate-900 rounded-full group-hover:bg-teal-400/10 transition-colors">
                        <Phone size={24} />
                     </div>
                     <span className="text-sm">Call</span>
                 </a>
                 <a href={resumeData.contact.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors flex flex-col items-center gap-2 group">
                     <div className="p-4 bg-slate-900 rounded-full group-hover:bg-teal-400/10 transition-colors">
                        <Linkedin size={24} />
                     </div>
                     <span className="text-sm">LinkedIn</span>
                 </a>
            </div>
            <p className="text-slate-600 text-sm">
                © {new Date().getFullYear()} {resumeData.name}. All rights reserved.
            </p>
        </section>

      </main>

      <style>{`
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translate3d(0, 40px, 0);
            }
            to {
                opacity: 1;
                transform: translate3d(0, 0, 0);
            }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;