"use client";

import React, { useState, useEffect } from "react";

// Icon Components
const DocumentIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ScaleIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CopyrightIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface TermsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const termsSections: TermsSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    icon: <DocumentIcon />,
    content: [
      "Welcome to the Holidays Era, this document constitutes a legally binding agreement governing the terms of providing you with our services. Throughout this document, the words Holidays Era, us, we and our, refer to our company, Holidays Era and our network or our service, as is appropriate in the context of the use of the words. Likewise, the words you, user, and you refer to you, the person who is being presented with this document for your agreement, though User may also refer to certain others as defined below.",
      "By using or accessing Holidays Era, you accept that you agree to and are subject to the following terms and conditions, as well as our Privacy Policy. If you do not fully agree to these Terms, Privacy Policy and any other terms and conditions posted or linked to our website, you are not authorized to access or otherwise use the website.",
      "Under these Terms, \"use\" or \"access\" of the Website specifically includes any direct or indirect access or use of the website or any cached version of the website and any direct or indirect access or use of any information or content on the website, regardless of how obtained and the term \"website\" includes, without limitation, any cached version thereof.",
      "We are an advertising service for Holiday homeowners or agencies and an accommodation search facility for Holidaymakers or guests. We do not own, inspect or provide content for any of the properties advertised on our website. However, we may provide photographs or videos, but we do not warrant that we have conducted any inspection of the property. The advertiser shall be responsible for ensuring that it has all necessary rights, licenses and authorisations to rent property.",
      "Except in relation to adverts allowing online booking where we may act as a support staff to facilitate payments to enable transactions between Advertiser and Holidaymaker, we have absolutely no involvement in the booking process or transaction. We make no claims as to the quality, safety or legality of any of the properties advertised. Neither can we confirm the accuracy of the advertisements or their content. It is the sole responsibility of the Advertiser to be eligible to rent the property and the sole responsibility of the Holidaymaker to pay for the rental.",
      "Please read the Terms of Use thoroughly before using our site. By using our site, you agree that you accept the Terms of Use. Please do not use our site if you do not agree to the Terms of Use."
    ]
  },
  {
    id: "material",
    title: "Material on Our Website",
    icon: <CopyrightIcon />,
    content: [
      "All copyright, database rights, trademarks and design rights on our website and in the material published on it belong to us, our licensors or our Advertisers.",
      "You may download material from our website for the sole purpose of using our website, but you must not copy, transmit, modify, republish, save, pass off or link to any content or material on our website without our prior written consent.",
      "You may forward material from our website to third parties by using our tools. By using our website tools, you confirm that you have obtained prior consent to receiving material from our website from any third parties to whom you send material.",
      "Advertisers, Holidaymakers or any other person shall not use our website for any marketing or advertising purposes which are not permitted by us. Any such use of our website shall, in our discretion, result in us refusing to list any property and/or discontinuing the ability of the person infringing this provision from using our website."
    ]
  },
  {
    id: "liability",
    title: "Our Liability and Responsibility",
    icon: <ScaleIcon />,
    content: [
      "We act merely as an advertising service through which Advertisers can advertise properties to Holidaymakers. We do not own, nor have we inspected, nor do we have any control whatsoever over any property listed on our website and we make no representations or warranties regarding any of the properties.",
      "While we require Advertisers to advertise properties truthfully, fairly and accurately, and we take reasonable steps to remove advertisements from our site following any complaint from a Holidaymaker or another Advertiser, we have no control over the accuracy of any advertisement or the capacity of any Advertiser to make a booking with a Holidaymaker.",
      "As such, we disclaim all liability and responsibility for any loss or damage (including personal injury) suffered or incurred by you or another party arising from:",
      "• Any reliance by any user of our website, or by anyone who may be informed of any of its contents, placed on any advertisement, commentary and other materials posted on our website by Advertisers, or any error or mistake or inaccuracy contained in any statement, description, representation or other information made about or in connection with a property listed on our website.",
      "• The act or omission of the Advertiser or any failure of the Advertiser to perform or comply with any of the terms of the contract between the Advertiser and you, including a failure to provide the property on the requested date (whether due to a double-booking or otherwise), or a failure to provide the property in the condition or with the amenities that such property was advertised on our site.",
      "• Any loss of or damage to personal possessions at a property.",
      "• Any incident or occurrence which takes place at a property.",
      "Although we will do our best to prevent intentional misuse of our site and the dissemination of harmful programs via our website, we will not be liable for any loss or damage caused by any intentional misuse of our website or the distribution of viruses or other technologically harmful material that may infect your computer equipment, computer programs, data or other proprietary material due to your use of our website.",
      "If we are in breach of these terms or otherwise liable to you (including, without limitation, for our negligence), we will only be responsible for any direct damages or losses you incur that result from your use of our website up to the value of the fees (if any) that you have paid to us. We shall not be liable for any indirect losses or damage suffered by you.",
      "Our liability to you shall not in any event include business losses (which includes without limitation loss or corruption of data, loss of profits or contracts, loss of revenue, loss of anticipated savings in expenditure, or business interruption) because of our breach of contract or negligence or otherwise.",
      "This does not affect our liability for fraudulent misrepresentation or if something we do negligently causes death or personal injury, nor any other liability which cannot be excluded or limited under applicable law.",
      "If you consider any of the content of any videos, photographs or any other material posted on our website by any Advertiser to be offensive, discriminatory, defamatory or libelous or otherwise inappropriate, please notify us of such content by sending us details of the content you consider to be inappropriate and the reason why you consider such content to be inappropriate."
    ]
  },
  {
    id: "safety",
    title: "Your Safety",
    icon: <ShieldIcon />,
    content: [
      "Consideration should always be given to the nature of advertisements and contracts transacted on the Internet, and the risks involved.",
      "Direct contact between Advertisers and Holidaymakers in relation to a booking may not occur and so you must therefore proceed with care and judgement while using our website."
    ]
  },
  {
    id: "claims",
    title: "Claims",
    icon: <AlertIcon />,
    content: [
      "Any contract for the rental of any property listed on our website is directly between an Advertiser and a Holidaymaker (each a \"Booking Contract\") and we are not a party to that contract.",
      "In recognition of this, you acknowledge that any claim you may have that is in any way connected with a dispute you have with an Advertiser on our website must be brought directly against that Advertiser and not against us."
    ]
  },
  {
    id: "payments",
    title: "Online Payments",
    icon: <CreditCardIcon />,
    content: [
      "We may provide an online payment platform, giving you the ability to make online payments to Advertisers via PayPal, credit card, debit card or other payment method. We may change or withdraw from such a platform at any time without notice at our sole discretion.",
      "Although we may provide the technical platform to enable such payments, we are not responsible for the payment solutions themselves, and we still are not a party to the contract between you and the Advertiser.",
      "We are not responsible for any decision taken by PayPal or another provider to decline your payment, based on its risk assessment of you or that transaction. You shall not hold us liable for any losses you suffer as a result of making an online payment to an Advertiser.",
      "If you need customer support in relation to an online payment, you should contact PayPal or your bank or credit card provider (as applicable).",
      "You agree to indemnify and keep us indemnified from and against any and all claims, actions, proceedings, damages, losses, liabilities and expenses (including legal fees) suffered or incurred by us arising out of or in connection with your use of our online payment platform to make payments to Advertisers, in particular any claims from Advertisers, PayPal or other payment solution providers resulting from your actions or omissions."
    ]
  }
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string>("introduction");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Update active section based on scroll position
      const sections = termsSections.map(s => s.id);
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section with Animation */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-3xl mb-8 backdrop-blur-lg shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <DocumentIcon />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-4">
              Your guide to using Holidays Era safely and responsibly
            </p>
            <p className="text-sm text-blue-200 font-medium">
              Last Updated: December 2024
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation with Enhanced Design */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-4 overflow-x-auto scrollbar-hide">
            {termsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`group relative px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                }`}
              >
                {activeSection === section.id && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 blur-md opacity-50"></span>
                )}
                <span className="relative">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Important Notice with Enhanced Design */}
          <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-8 mb-16 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 rounded-full -mr-16 -mt-16 opacity-30"></div>
            <div className="relative flex items-start gap-5">
              <div className="flex-shrink-0 p-3 bg-amber-100 rounded-xl">
                <AlertIcon />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-3">Important Notice</h3>
                <p className="text-amber-800 leading-relaxed">
                  By using or accessing Holidays Era, you accept that you agree to and are subject to the following terms and conditions, as well as our Privacy Policy. If you do not fully agree to these Terms, you are not authorized to access or otherwise use the website.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Sections with Enhanced Cards */}
          <div className="space-y-10">
            {termsSections.map((section, index) => (
              <div
                key={section.id}
                id={section.id}
                className="scroll-mt-32 group"
              >
                <div className="relative bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  {/* Decorative gradient overlay */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg">
                          {section.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                            Section {index + 1}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-5">
                    {section.content.map((paragraph, pIndex) => (
                      <div key={pIndex} className="flex items-start gap-3">
                        {paragraph.startsWith("•") ? (
                          <>
                            <div className="flex-shrink-0 mt-1.5 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                            <p className="flex-1 text-gray-700 leading-relaxed">
                              {paragraph.substring(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-700 leading-relaxed">
                            {paragraph}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Points Summary */}
          <div className="mt-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
            
            <div className="relative">
              <h3 className="text-3xl font-bold mb-6">Key Takeaways</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "We're a marketplace connecting property owners and holidaymakers",
                  "All bookings are directly between you and property owners",
                  "We provide the platform but don't own or inspect properties",
                  "Review terms carefully before making any booking"
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                      <CheckIcon />
                    </div>
                    <p className="text-blue-50">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section with Enhanced Design */}
          <div className="mt-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-12 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
            <div className="relative">
              <h3 className="text-3xl font-bold mb-4">Have Questions?</h3>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                If you have any questions about these Terms of Service, please don't hesitate to contact us. We're here to help clarify any concerns you may have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group relative px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <span className="relative z-10">Contact Us</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </button>
                <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Help Center
                </button>
              </div>
            </div>
          </div>

          {/* Agreement Confirmation */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-gray-600 text-sm font-medium">
                By continuing to use Holidays Era, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}