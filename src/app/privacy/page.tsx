"use client";

import React, { useState } from "react";
import Link from "next/link";

// Icon Components
const ShieldCheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const DatabaseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const BanIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

interface PolicySection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const policySections: PolicySection[] = [
  {
    id: "collection",
    title: "Collection of Information",
    icon: <DatabaseIcon />,
    content: [
      "We collect information like email addresses or other personal information required for authentication of property owners. This information is either collected through website forms, email communication or a direct phone call.",
      "This information is strictly used for owner identification and future correspondences only. We do not get involved in any information selling processes. Privacy of the information is our priority.",
      "Property details, photos and other information are provided by the property owners. Holidays Era is not responsible for any data discrepancy / delicacy or authenticity as it is the owner's copyright and their responsibility.",
      "We also record the IP address of the visitor for statistics and analytics purposes on the listing pages of our website."
    ]
  },
  {
    id: "email",
    title: "Email Marketing & Messages",
    icon: <MailIcon />,
    content: [
      "We do not entertain spamming and are strictly against it. All our email messages and promotions are either to our users, registered owners, people who have shown interest in our services or people who have subscribed to our newsletter to receive such promotions.",
      "If you do not wish to receive emails or promotions from us, please contact support at care@holidaysera.com or simply click on the Unsubscribe link on these email messages."
    ]
  },
  {
    id: "security",
    title: "Security of Information",
    icon: <LockIcon />,
    content: [
      "We understand the importance of financial information and other important information you share while checking out, and we take serious care of it.",
      "Any financial information you shared for a sale or transaction purpose is not stored by us. All these transactions are carried out on a secure server."
    ]
  },
  {
    id: "safety",
    title: "Your Safety",
    icon: <ShieldCheckIcon />,
    content: [
      "Consideration should always be given to the nature of advertisements and contracts transacted on the Internet, and the risks involved.",
      "Direct contact between Advertisers and Holidaymakers in relation to a booking may not occur and so you must therefore proceed with care and judgement when using our site."
    ]
  },
  {
    id: "surveys",
    title: "Surveys & Feedback",
    icon: <ClipboardIcon />,
    content: [
      "We do feedback surveys from time to time, and we request users to input their valuable comments on our services or their experience with us.",
      "The decision to answer the survey is solely with the user. Users may or may not fill in the details depending on their discretion."
    ]
  },
  {
    id: "telephone",
    title: "Telephone Calls",
    icon: <PhoneIcon />,
    content: [
      "In addition to collecting data online, we may also speak to our users on the phone. This can either be for customer support or any promotional marketing which we want to explain to our users.",
      "If you wish to unsubscribe from these calls, please contact us at info@holidaysera.com or inform the telephone representative about the same. We follow strict DNC rules."
    ]
  },
  {
    id: "inquiries",
    title: "Rental Inquiries",
    icon: <UsersIcon />,
    content: [
      "Travelers send inquiries through Contact the Owner forms on listing pages. Once a traveler chooses to send a booking request, he/she should understand that the personal information filled in the form, like email, phone and other information, will be shared with the property owner.",
      "We request users not to enter any financial information like credit card numbers or bank account information in any of our contact forms."
    ]
  },
  {
    id: "phishing",
    title: "Phishing or False Emails",
    icon: <AlertTriangleIcon />,
    content: [
      "If you receive an unsolicited email requesting personal information like credit card, bank account, date of birth or even your account credentials with us, please be informed that this must be from someone trying to gain access to your information unlawfully.",
      "We do not request such information in emails. Please contact us at care@holidaysera.com if you receive something like this."
    ]
  }
];

const additionalPolicies = [
  {
    title: "Partners Terms",
    icon: <UsersIcon />,
    content: [
      "Partners will do their best to promote the Holidays Era using the creative materials and packages provided by Holidays Era.",
      "Holidays Era helps Users, advertisers and affiliates achieve their goals. Whether it's driving sales and bookings and holidays for our partners, getting their messages in front of a targeted audience of travelers right when they are thinking about traveling, or showing them how to best utilize our travel booking solutions.",
      "All Creative will be solely provided by Holidays Era alone except where agreed to by Holidays Era in writing in advance. The Creative is provided \"as is\" and without warranty of any kind.",
      "For partner or affiliate inquiries, contact us at partners@holidaysera.com or affiliates@holidaysera.com"
    ]
  },
  {
    title: "Disclaimers",
    icon: <DocumentIcon />,
    content: [
      "holidaysera.com is a listing service and the main purpose of the business is to advertise rental properties through our website. The website is not responsible for any of the incorrect information listed on this website.",
      "Renters are responsible for verifying complete information about the property before getting into any kind of contract with homeowners, property managers or agencies. Owners should also do their research about renters before qualifying them.",
      "As we are not involved in any transactions, we have no control over the quality, safety or legality of the items advertised. We advise owners and renters to get complete information before getting into any agreement or payments.",
      "Holidays Era is not a licensed real estate broker in any state and is not acting as a property management agent. The sole purpose of this website is advertising."
    ]
  },
  {
    title: "Transfer & Cancellation",
    icon: <RefreshIcon />,
    content: [
      "Holidays Era memberships are easily transferable upon the date of transfer of holiday rental in case of property sold or transferred to new owner. Homeowners provide us with the new owner's name, address and billing address and we will contact the new owner and do the needful upon their approval.",
      "Holidays Era accounts or listings can be canceled anytime. Just notify us and we will cancel the account and remove the Ad from our website in not more than 72 hours.",
      "No refund or Pro-Rated credit will be issued for cancellation by the owner."
    ]
  },
  {
    title: "Listing & Content Policies",
    icon: <HomeIcon />,
    content: [
      "Holidays Era reserves the right to cancel or remove a listing which has not passed our audit procedure. We do periodic reviews on listings and any listing that does not meet our standards and terms, holidaysera.com reserves full right to delete or remove the listing.",
      "Under any circumstances, holidaysera.com will not allow any vulgarity, comments related to violence, sexual nature or color discrimination.",
      "After submitting the property information on our website, it becomes copyrighted property on holidaysera.com and we reserve the right to alter, edit or delete part of the information which does not follow our listing policies."
    ]
  },
  {
    title: "Spam Policy",
    icon: <BanIcon />,
    content: [
      "holidaysera.com never participates in spamming and will not allow someone to do so through our website. Any unauthorized use of information by third parties will be subject to copyright law violations and will be subject to criminal prosecution.",
      "It is the goal of holidaysera.com to reduce the volume of SPAM delivered via the Vacation Rental Information and Availability Request (Inquiry) form. To that end, inquiries may be monitored and filtered by holidaysera.com prior to delivery.",
      "Rental inquiries are delivered via Internet email and are not to be considered private. Internet e-mail delivery is not 100% reliable and holidaysera.com cannot be held responsible for undelivered inquiries or for missed income because of undelivered inquiries."
    ]
  }
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string>("collection");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
            <ShieldCheckIcon />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-emerald-200 mt-6">
            Last Updated: December 2024
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      {/* <section className="relative -mt-8 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl mb-3">
                <LockIcon />
              </div>
              <h3 className="font-semibold text-gray-900">Secure Data</h3>
              <p className="text-sm text-gray-500 mt-1">Your data is encrypted and protected</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl mb-3">
                <XCircleIcon />
              </div>
              <h3 className="font-semibold text-gray-900">No Data Selling</h3>
              <p className="text-sm text-gray-500 mt-1">We never sell your personal information</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl mb-3">
                <RefreshIcon />
              </div>
              <h3 className="font-semibold text-gray-900">Easy Opt-Out</h3>
              <p className="text-sm text-gray-500 mt-1">Unsubscribe anytime, no questions asked</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Navigation Pills */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {policySections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Policy Sections */}
          <div className="space-y-8">
            {policySections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-xl">
                    {section.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                </div>
                <div className="p-6 space-y-3">
                  {section.content.map((paragraph, index) => (
                    <p key={index} className="text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Opt Out Section */}
          <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <MailIcon />
              Opting Out of Marketing Messages
            </h3>
            <p className="text-amber-700 mb-4">
              As a part of marketing, we may contact you through email or phone. You can opt out of these marketing communications by:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-amber-700">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                Contact us at our support email
              </li>
              <li className="flex items-center gap-2 text-amber-700">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                Click on the UNSUBSCRIBE link in any email
              </li>
            </ul>
          </div>

          {/* Additional Policies Grid */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Additional Policies</h2>
            <div className="space-y-6">
              {additionalPolicies.map((policy, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-center w-10 h-10 bg-teal-600 text-white rounded-xl">
                      {policy.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">{policy.title}</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    {policy.content.map((text, textIndex) => (
                      <p key={textIndex} className="text-gray-600 leading-relaxed">
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Site Updates Notice */}
          <div className="mt-12 bg-gray-100 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-600 rounded-xl mb-4">
              <RefreshIcon />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Site Updates</h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              Holidays Era reserves all the right to update or make changes to our main website at any time without notice. By using the site and services, you agree to the terms and conditions of this policy.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Questions About Privacy?</h3>
            <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
              If you have any questions about our Privacy Policy, Terms & Conditions, or marketing processes, we are here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/terms"
                className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-400 transition-colors"
              >
                View Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
