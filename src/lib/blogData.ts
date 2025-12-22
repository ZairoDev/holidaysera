// Mock Blog Data Service
// TODO: Replace with actual API calls when backend is ready

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  image?: string;
}

// Mock blog posts data
const mockBlogs: BlogPost[] = [
  {
    slug: "top-10-vacation-destinations-2024",
    title: "Top 10 Vacation Destinations for 2024",
    excerpt: "Discover the most sought-after vacation destinations that are trending this year. From tropical paradises to mountain retreats, find your perfect getaway.",
    author: "Sarah Johnson",
    publishedDate: "2024-12-15",
    image: "/new.jpg",
    content: `
      <p>Planning your next vacation? 2024 brings exciting new destinations and returning favorites that promise unforgettable experiences. Whether you're seeking adventure, relaxation, or cultural immersion, these top destinations offer something for every traveler.</p>
      
      <h2>1. Santorini, Greece</h2>
      <p>The stunning Greek island continues to captivate visitors with its iconic white-washed buildings, crystal-clear waters, and breathtaking sunsets. Perfect for romantic getaways and photography enthusiasts.</p>
      
      <h2>2. Bali, Indonesia</h2>
      <p>From pristine beaches to lush rice terraces and ancient temples, Bali offers a perfect blend of natural beauty and rich culture. The island's warm hospitality makes it a favorite among travelers worldwide.</p>
      
      <h2>3. Swiss Alps, Switzerland</h2>
      <p>Experience world-class skiing, charming mountain villages, and stunning alpine scenery. The Swiss Alps offer year-round activities from winter sports to summer hiking.</p>
      
      <h2>Why These Destinations Stand Out</h2>
      <p>Each destination on our list has been carefully selected based on traveler reviews, unique experiences offered, and overall value. These locations provide excellent vacation rental options, making your stay comfortable and memorable.</p>
      
      <h2>Planning Your Trip</h2>
      <p>When booking your vacation rental, consider factors like location, amenities, and seasonal weather. Early booking often secures better rates and more options. Browse our extensive collection of properties in these destinations to find your perfect match.</p>
    `
  },
  {
    slug: "ultimate-guide-booking-vacation-rentals",
    title: "The Ultimate Guide to Booking Vacation Rentals",
    excerpt: "Learn essential tips and tricks for finding and booking the perfect vacation rental. Save money and avoid common pitfalls with our comprehensive guide.",
    author: "Michael Chen",
    publishedDate: "2024-12-10",
    image: "/new.jpg",
    content: `
      <p>Booking a vacation rental can be overwhelming with so many options available. This comprehensive guide will help you navigate the process and find the perfect property for your needs.</p>
      
      <h2>Start Your Search Early</h2>
      <p>The best properties get booked months in advance, especially during peak seasons. Starting your search early gives you access to the widest selection and often better pricing options.</p>
      
      <h2>Know What You Need</h2>
      <p>Before you start browsing, make a list of must-have amenities and features. Consider the number of bedrooms, bathrooms, kitchen facilities, parking, and proximity to attractions or beaches.</p>
      
      <h2>Read Reviews Carefully</h2>
      <p>Guest reviews provide invaluable insights into the property and host. Look for recent reviews and pay attention to comments about cleanliness, accuracy of listing, and host responsiveness.</p>
      
      <h2>Understanding Pricing</h2>
      <p>Look beyond the nightly rate. Factor in cleaning fees, service charges, and any additional costs. Compare the total price across different properties to find the best value.</p>
      
      <h2>Communication is Key</h2>
      <p>Don't hesitate to message the host with questions before booking. Clear communication helps ensure the property meets your expectations and establishes a good relationship with your host.</p>
      
      <h2>Book with Confidence</h2>
      <p>Use trusted platforms that offer secure payment processing and guest protection. Read the cancellation policy carefully and consider travel insurance for added peace of mind.</p>
    `
  },
  {
    slug: "benefits-vacation-rentals-vs-hotels",
    title: "5 Benefits of Vacation Rentals vs Hotels",
    excerpt: "Wondering whether to book a hotel or vacation rental? Discover why more travelers are choosing vacation rentals for their trips.",
    author: "Emma Williams",
    publishedDate: "2024-12-05",
    image: "/new.jpg",
    content: `
      <p>The debate between vacation rentals and hotels has been ongoing for years. While hotels offer certain conveniences, vacation rentals provide unique advantages that make them the preferred choice for many modern travelers.</p>
      
      <h2>1. More Space and Privacy</h2>
      <p>Vacation rentals typically offer significantly more space than hotel rooms. Enjoy separate living areas, multiple bedrooms, and private outdoor spaces. This extra room means more comfort and privacy for you and your travel companions.</p>
      
      <h2>2. Cost-Effective for Groups</h2>
      <p>When traveling with family or friends, vacation rentals often prove more economical than booking multiple hotel rooms. Split the cost among travelers while enjoying shared spaces and amenities.</p>
      
      <h2>3. Kitchen Facilities</h2>
      <p>Having a full kitchen allows you to prepare meals, save money on dining out, and accommodate dietary restrictions. It's especially convenient for families with children or extended stays.</p>
      
      <h2>4. Local Experience</h2>
      <p>Stay in residential neighborhoods and experience destinations like a local. Shop at neighborhood markets, discover hidden gems, and immerse yourself in the authentic culture of your destination.</p>
      
      <h2>5. Flexible Amenities</h2>
      <p>From hot tubs and private pools to game rooms and workspaces, vacation rentals offer diverse amenities tailored to different needs. Choose properties with features that enhance your specific travel style.</p>
      
      <h2>The Verdict</h2>
      <p>While hotels have their place, vacation rentals provide flexibility, space, and value that appeal to today's travelers. Whether you're planning a family vacation, romantic getaway, or extended business trip, a vacation rental might be your ideal accommodation choice.</p>
    `
  },
  {
    slug: "preparing-your-home-for-guests",
    title: "Preparing Your Home for Vacation Guests",
    excerpt: "Property owners: Learn how to create an exceptional guest experience. Essential tips for preparing your vacation rental to receive 5-star reviews.",
    author: "David Martinez",
    publishedDate: "2024-11-28",
    image: "/new.jpg",
    content: `
      <p>As a vacation rental host, creating a welcoming environment is crucial for guest satisfaction and positive reviews. Follow these essential steps to ensure your property is guest-ready.</p>
      
      <h2>Deep Clean Everything</h2>
      <p>Cleanliness is the number one factor in guest reviews. Ensure every surface, corner, and fixture is spotless. Pay special attention to kitchens, bathrooms, and high-touch areas.</p>
      
      <h2>Stock Essential Supplies</h2>
      <p>Provide basics like toilet paper, paper towels, dish soap, trash bags, and coffee. Consider extras like spices, cooking oil, and condiments. These small touches make a big difference in guest comfort.</p>
      
      <h2>Create a Welcome Guide</h2>
      <p>Compile important information including WiFi passwords, appliance instructions, local restaurant recommendations, and emergency contacts. A well-organized guide helps guests feel at home quickly.</p>
      
      <h2>Check All Amenities</h2>
      <p>Test every appliance, fixture, and amenity before guests arrive. Replace burnt-out light bulbs, check HVAC systems, and ensure all technology works properly.</p>
      
      <h2>Add Personal Touches</h2>
      <p>Fresh flowers, welcome baskets, or local treats create memorable first impressions. These thoughtful gestures show guests you care about their experience.</p>
      
      <h2>Quality Linens and Towels</h2>
      <p>Invest in hotel-quality bedding and plenty of soft towels. Comfortable, clean linens directly impact guest satisfaction and sleep quality.</p>
      
      <h2>Safety First</h2>
      <p>Ensure smoke detectors work, provide fire extinguishers, and clearly mark emergency exits. Guest safety should always be your top priority.</p>
    `
  },
  {
    slug: "seasonal-travel-tips-winter-escapes",
    title: "Seasonal Travel Tips: Winter Escapes",
    excerpt: "Planning a winter vacation? Get expert advice on choosing destinations, packing essentials, and making the most of cold-weather getaways.",
    author: "Lisa Anderson",
    publishedDate: "2024-11-20",
    image: "/new.jpg",
    content: `
      <p>Winter travel offers unique opportunities from snow-covered mountains to warm tropical escapes. Whether you're chasing powder or sunshine, proper planning ensures a perfect winter vacation.</p>
      
      <h2>Choose Your Winter Experience</h2>
      <p>Decide between embracing winter with skiing and snow activities, or escaping to warmer climates. Each option offers distinct advantages and unique experiences.</p>
      
      <h2>Ski Resort Destinations</h2>
      <p>Popular winter sports destinations include the Alps, Rocky Mountains, and Scandinavian resorts. Book accommodations near ski lifts for convenience, and verify rental properties include gear storage and drying areas.</p>
      
      <h2>Tropical Winter Getaways</h2>
      <p>Escape cold weather in destinations like Caribbean islands, Southeast Asia, or Central America. These locations offer perfect weather when much of the world experiences winter.</p>
      
      <h2>Packing Smart</h2>
      <p>For cold destinations, pack layers, quality winter gear, and waterproof clothing. For warm escapes, don't forget sunscreen, light clothing, and swimwear. Check your rental property's amenities to avoid over-packing.</p>
      
      <h2>Winter Travel Savings</h2>
      <p>Off-peak travel during early winter or late season often means better deals and fewer crowds. Flexibility with dates can lead to significant savings on both rentals and activities.</p>
      
      <h2>Health and Safety</h2>
      <p>Winter travel requires extra precautions. Check weather forecasts regularly, have emergency supplies if driving, and ensure travel insurance covers winter activities.</p>
    `
  },
  {
    slug: "family-friendly-vacation-planning",
    title: "Family-Friendly Vacation Planning Made Easy",
    excerpt: "Traveling with kids? Discover how to plan stress-free family vacations that everyone will enjoy. Tips for choosing kid-friendly rentals and activities.",
    author: "James Brown",
    publishedDate: "2024-11-15",
    image: "/new.jpg",
    content: `
      <p>Planning a family vacation requires extra consideration, but with proper preparation, you can create wonderful memories while keeping stress levels low.</p>
      
      <h2>Choose the Right Property</h2>
      <p>Look for rentals with multiple bedrooms, child-safety features, and family-friendly amenities like cribs, high chairs, and toys. Fenced yards and pools with safety barriers are valuable for families with young children.</p>
      
      <h2>Location Matters</h2>
      <p>Select properties near family attractions, parks, and restaurants. Proximity to grocery stores helps when you need supplies quickly. Consider quiet neighborhoods for better sleep.</p>
      
      <h2>Plan Age-Appropriate Activities</h2>
      <p>Research activities suitable for your children's ages. Mix educational experiences with fun recreation. Having a flexible itinerary prevents over-scheduling and allows for spontaneous fun.</p>
      
      <h2>Pack Strategically</h2>
      <p>Bring comfort items like favorite toys or blankets. Check if your rental provides basic supplies like beach toys or board games. Make a detailed packing list to avoid forgetting essentials.</p>
      
      <h2>Maintain Routines</h2>
      <p>Try to keep meal and sleep schedules similar to home. This helps children adjust better and reduces crankiness. Rentals with kitchens make maintaining normal meal routines easier.</p>
      
      <h2>Budget for Family Travel</h2>
      <p>Family vacations can be expensive. Vacation rentals often provide better value than hotels for families. Cooking some meals at your rental saves significantly on dining costs.</p>
      
      <h2>Create Lasting Memories</h2>
      <p>Take plenty of photos, involve kids in planning, and embrace imperfect moments. The best family vacations are about quality time together, not perfect execution.</p>
    `
  }
];

/**
 * Get all blog posts
 * 
 * TODO: Replace with API call
 * Example: 
 * export async function getBlogs() {
 *   const response = await fetch('/api/blogs');
 *   return response.json();
 * }
 */
export function getBlogs(): BlogPost[] {
  return mockBlogs;
}

/**
 * Get a single blog post by slug
 * 
 * TODO: Replace with API call
 * Example:
 * export async function getBlogBySlug(slug: string) {
 *   const response = await fetch(`/api/blogs/${slug}`);
 *   return response.json();
 * }
 */
export function getBlogBySlug(slug: string): BlogPost | undefined {
  return mockBlogs.find(blog => blog.slug === slug);
}


