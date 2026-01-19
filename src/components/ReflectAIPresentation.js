import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Brain, Lightbulb, MessageSquare, Send } from 'lucide-react';

const ReflectAIPresentation = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sections = [
    'intro',
    'problem',
    'autonomy',
    'work',
    'solution',
    'design',
    'prototype'
  ];

  const scrollToSection = (index) => {
    setCurrentSection(index);
    const element = document.getElementById(sections[index]);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.REACT_APP_GROQ_API_KEY;
      if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
        throw new Error('REACT_APP_GROQ_API_KEY is not set');
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `ReflectAI is a reflective decision-support system. It does not decide, rank, or recommend options.

Its responses must be concise and focused on:

Clarifying the user’s values and priorities

Offering 2–3 contrasting perspectives

Identifying key trade-offs or long-term implications

Noting ethical dimensions (consequences, duties, character)

Use ethical lenses briefly when relevant:

Virtue ethics — character shaped

Deontology — duties or principles

Consequentialism — long-term outcomes

Rules:

Never state which option is “best”

Avoid long explanations or multiple paragraphs

End with 1–3 reflective questions, not advice`
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.choices[0].message.content
        }]);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please make sure you have added your Groq API key to the code (replace YOUR_GROQ_API_KEY_HERE in the fetch request).'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">ReflectAI</h1>
            <div className="flex gap-6 text-sm">
              {['Intro', 'Problem', 'Autonomy', 'Work', 'Solution', 'Design', 'Prototype'].map((label, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSection(i)}
                  className={`transition-colors ${currentSection === i ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="intro" className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 bg-blue-50 rounded-full mb-6">
            <Brain className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI and the Meaning of the "Good Life"
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Exploring how artificial intelligence reshapes human flourishing, autonomy, and the pursuit of eudaimonia in the 21st century.
          </p>
          <button
            onClick={() => scrollToSection(1)}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Explore the Issue
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* The Problem */}
      <section id="problem" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">The Central Question</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Traditional "Good Life" (Eudaimonia)</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Active participation in meaningful activities</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Cultivation of virtues and moral development</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Rational activity and self-authorship</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Agency, dignity, and social belonging</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">AI's Promise vs. Risk</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-green-600 mt-1">+</span>
                  <span>Enhanced efficiency and reduced suffering</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 mt-1">+</span>
                  <span>Expanded knowledge and capability</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 mt-1">−</span>
                  <span>Passive consumption over meaningful struggle</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 mt-1">−</span>
                  <span>Optimization replacing human judgment</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg">
            <p className="text-lg text-gray-800 italic">
              "Can a world increasingly mediated by intelligent systems still support the conditions necessary for genuine human flourishing?"
            </p>
          </div>
        </div>
      </section>

      {/* Autonomy & Agency */}
      <section id="autonomy" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Threat to Autonomy & Cognitive Agency</h2>
          
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">The Paradox</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <div className="text-blue-600 font-semibold mb-2">Choice Architecture</div>
                <p className="text-gray-700 text-sm">Algorithms shape what we see, what options appear, and what gets recommended—constraining autonomy without awareness.</p>
              </div>
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <div className="text-blue-600 font-semibold mb-2">Cognitive Offloading</div>
                <p className="text-gray-700 text-sm">Delegating thinking to machines reduces immediate load but weakens critical thinking and problem-solving over time.</p>
              </div>
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <div className="text-blue-600 font-semibold mb-2">Erosion of Self-Authorship</div>
                <p className="text-gray-700 text-sm">Relying on algorithmic guidance replaces personal reasoning, diminishing the capacity for meaningful agency.</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-500">
            <h4 className="font-semibold text-gray-900 mb-3">The Ethical Question</h4>
            <p className="text-gray-800">
              AI can enhance human capability, yet excessive dependence risks diminishing the very capacities that define meaningful agency. Where is the boundary between augmentation and erosion?
            </p>
          </div>
        </div>
      </section>

      {/* Work & Meaning */}
      <section id="work" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Work, Purpose & Transformation of Meaning</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Work Matters</h3>
              <p className="text-gray-700 mb-4">
                Work has historically been central to identity, structure, and meaning. It provides more than income—it offers purpose, mastery, and social recognition.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Optimistic View</h4>
                <p className="text-gray-700 text-sm">
                  AI could liberate humans from monotonous labor, enabling greater engagement in creative, relational, and civic activities.
                </p>
              </div>
              <div className="p-6 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-3">Critical Concern</h4>
                <p className="text-gray-700 text-sm">
                  If AI replaces complex, skill-based work rather than supporting it, individuals may experience alienation and diminished contribution.
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">The STS Perspective</h4>
              <p className="text-gray-800">
                Technological change reflects political and economic choices. Whether AI leads to flourishing or alienation depends on how societies restructure education, labor, and social support systems. Without intentional design and policy, AI risks amplifying inequality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section id="solution" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
              <Lightbulb className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Proposal: ReflectAI</h2>
            <p className="text-xl text-gray-600">
              An AI-Assisted Reflective Decision Support System
            </p>
          </div>

          <div className="space-y-8">
            <div className="p-8 bg-white rounded-lg border-2 border-blue-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Philosophy</h3>
              <p className="text-gray-700 mb-4">
                ReflectAI is a human-in-the-loop AI decision-support application designed to promote deliberate thinking and self-reflection rather than automatic optimization.
              </p>
              <p className="text-lg font-medium text-blue-600">
                The AI acts as a reflection partner, not a decision-maker.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">What It Does</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Presents multiple perspectives</li>
                  <li>Analyzes trade-offs</li>
                  <li>Explores long-term implications</li>
                  <li>Asks questions, not answers</li>
                </ul>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">What It Preserves</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Human autonomy</li>
                  <li>Critical thinking</li>
                  <li>Moral reasoning</li>
                  <li>Self-authorship</li>
                </ul>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">What It Avoids</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Ranking choices</li>
                  <li>Algorithmic nudging</li>
                  <li>Optimization pressure</li>
                  <li>Passive consumption</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Design */}
      <section id="design" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Conceptual System Design</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Input: User-Defined Dilemma</h3>
                <p className="text-gray-700">User describes a personal decision or dilemma they're facing (career choices, time management, lifestyle decisions, etc.)</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Processing Module</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Natural language processing to interpret the problem</li>
                  <li>Ethical reasoning based on philosophical frameworks:</li>
                  <li className="ml-6">Virtue ethics (character development)</li>
                  <li className="ml-6">Deontology (duties and principles)</li>
                  <li className="ml-6">Consequentialism (outcomes and impacts)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Output: Reflective Guidance</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Structured reflection prompts</li>
                  <li>Value-based trade-off analysis</li>
                  <li>Thought-provoking questions (not recommendations)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-orange-50 rounded-lg border-2 border-orange-300">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Human Control</h3>
                <p className="text-gray-700 font-medium">User must make the final decision. AI cannot "rank" choices or recommend a "best" option.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Contribution to the Good Life</h3>
            <p className="text-blue-50">
              ReflectAI supports human flourishing by strengthening agency, self-awareness, and responsibility—core elements of eudaimonia. It resists the trend toward passive optimization and instead cultivates the intellectual and moral capacities that give life meaning.
            </p>
          </div>
        </div>
      </section>

      {/* Prototype */}
      <section id="prototype" className="py-20 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
              <MessageSquare className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Try ReflectAI Prototype</h2>
            <p className="text-gray-600 mb-2">
              Experience reflective decision support in action
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="mb-4">Share a decision or dilemma you're facing.</p>
                    <p className="text-sm">ReflectAI will help you think it through—not decide for you.</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex chat-message ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg">
                    <p className="text-sm text-gray-600">Reflecting...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Describe your decision or dilemma..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Example Prompts to Try:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>"I'm choosing between a high-paying corporate job and a lower-paying nonprofit role that aligns with my values."</li>
              <li>"I spend 4 hours daily on social media. Should I quit or moderate?"</li>
              <li>"I'm considering using AI tools for all my work tasks to be more efficient."</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-300">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-2">ReflectAI - STS Final Project</p>
          <p className="text-sm text-gray-500">
            Exploring AI and the Good Life through Human-Centered Design
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ReflectAIPresentation;