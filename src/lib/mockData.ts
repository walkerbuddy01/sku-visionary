
export interface SKUData {
  id: string;
  sku: string;
  productName: string;
  category: string;
  currentStock: number;
  forecastSales: number;
  recommendedOrder: number;
  revenue: number;
  date: string;
  actualSales?: number;
  forecastStock?: number;
  accuracy?: number;
}

// Categories for mock data
const categories = [
  "Electronics",
  "Clothing",
  "Home Goods",
  "Toys",
  "Books",
  "Beauty",
  "Sports",
  "Automotive"
];

// Product name prefixes for each category
const productPrefixes: Record<string, string[]> = {
  Electronics: ["Smart", "Ultra", "Pro", "Digital", "Power"],
  Clothing: ["Summer", "Casual", "Premium", "Sport", "Vintage"],
  "Home Goods": ["Luxury", "Essential", "Modern", "Classic", "Designer"],
  Toys: ["Educational", "Interactive", "Wooden", "Adventure", "Creative"],
  Books: ["Bestseller", "Classic", "Modern", "Children's", "Reference"],
  Beauty: ["Natural", "Organic", "Professional", "Luxury", "Essential"],
  Sports: ["Performance", "Professional", "Training", "Outdoor", "Competition"],
  Automotive: ["Premium", "Essential", "Performance", "Classic", "Heavy-Duty"]
};

// Product name suffixes for each category
const productSuffixes: Record<string, string[]> = {
  Electronics: ["Phone", "Tablet", "Laptop", "Headphones", "Camera", "Speaker", "TV", "Watch"],
  Clothing: ["T-shirt", "Jeans", "Jacket", "Dress", "Sweater", "Shirt", "Pants", "Socks"],
  "Home Goods": ["Lamp", "Table", "Chair", "Sofa", "Bed", "Pillow", "Vase", "Rug"],
  Toys: ["Blocks", "Doll", "Car", "Robot", "Puzzle", "Game", "Plush", "Action Figure"],
  Books: ["Novel", "Biography", "Cookbook", "Textbook", "Magazine", "Guide", "Dictionary"],
  Beauty: ["Cream", "Shampoo", "Lotion", "Perfume", "Mask", "Oil", "Serum", "Soap"],
  Sports: ["Shoes", "Ball", "Racket", "Gloves", "Helmet", "Bat", "Board", "Weights"],
  Automotive: ["Parts", "Oil", "Tool", "Cover", "Cleaner", "Mount", "Charger"]
};

// Generate a random SKU code
const generateSKU = (category: string) => {
  const prefix = category.substring(0, 2).toUpperCase();
  const number = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${number}`;
};

// Generate a random product name
const generateProductName = (category: string) => {
  const prefixes = productPrefixes[category] || ["Standard"];
  const suffixes = productSuffixes[category] || ["Product"];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix} ${suffix}`;
};

// Generate mock data
export const generateMockData = (
  count: number, 
  timeFrame: "daily" | "weekly" | "monthly" | "quarterly" | "yearly",
  category: "salesTrends" | "financialGoals" | "manual"
): SKUData[] => {
  const data: SKUData[] = [];
  
  // Multiplier for different categories and time frames
  const revenueMultiplier = 
    category === "salesTrends" ? 1 : 
    category === "financialGoals" ? 1.2 : 0.9;
  
  const timeMultiplier = 
    timeFrame === "daily" ? 1 :
    timeFrame === "weekly" ? 7 :
    timeFrame === "monthly" ? 30 :
    timeFrame === "quarterly" ? 90 : 365;
  
  for (let i = 0; i < count; i++) {
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    const sku = generateSKU(selectedCategory);
    const productName = generateProductName(selectedCategory);
    
    const currentStock = Math.floor(Math.random() * 200) + 10;
    const forecastSales = Math.floor(Math.random() * 50 * timeMultiplier) + 5;
    const actualSales = Math.floor(forecastSales * (0.7 + Math.random() * 0.6));
    const recommendedOrder = Math.max(0, forecastSales - currentStock + 20);
    const baseRevenue = (Math.random() * 100 + 10) * forecastSales;
    const revenue = Math.floor(baseRevenue * revenueMultiplier);
    const accuracy = Math.floor((1 - Math.abs(forecastSales - actualSales) / forecastSales) * 100);
    
    // Generate a date based on the timeframe
    const date = new Date();
    if (i > 0) {
      if (timeFrame === "daily") date.setDate(date.getDate() - i);
      else if (timeFrame === "weekly") date.setDate(date.getDate() - i * 7);
      else if (timeFrame === "monthly") date.setMonth(date.getMonth() - i);
      else if (timeFrame === "quarterly") date.setMonth(date.getMonth() - i * 3);
      else date.setFullYear(date.getFullYear() - i);
    }
    
    data.push({
      id: `sku-${i}`,
      sku,
      productName,
      category: selectedCategory,
      currentStock,
      forecastSales,
      recommendedOrder,
      revenue,
      date: date.toISOString().split('T')[0],
      actualSales,
      forecastStock: Math.max(0, currentStock - forecastSales),
      accuracy
    });
  }
  
  return data;
};

// Aggregate data for graph visualization
export const aggregateDataForGraphs = (data: SKUData[], timeFrame: string) => {
  // Group data by date and aggregate values
  const groupedData: Record<string, any> = {};
  
  data.forEach(item => {
    const dateKey = item.date;
    
    if (!groupedData[dateKey]) {
      groupedData[dateKey] = {
        name: formatDateLabel(item.date, timeFrame),
        sales: 0,
        revenue: 0,
        currentStock: 0,
        forecastStock: 0,
        recommendedOrder: 0,
        actualSales: 0,
        forecastSales: 0,
        accuracy: 0,
        categorySales: 0
      };
    }
    
    groupedData[dateKey].sales += item.forecastSales;
    groupedData[dateKey].revenue += item.revenue;
    groupedData[dateKey].currentStock += item.currentStock;
    groupedData[dateKey].forecastStock += (item.forecastStock || 0);
    groupedData[dateKey].recommendedOrder += item.recommendedOrder;
    groupedData[dateKey].actualSales += (item.actualSales || 0);
    groupedData[dateKey].forecastSales += item.forecastSales;
    groupedData[dateKey].categorySales += (item.category === "Electronics" ? item.forecastSales : 0);
    
    // Average accuracy
    groupedData[dateKey].accuracy = 
      groupedData[dateKey].actualSales > 0 
        ? Math.min(100, Math.floor((1 - Math.abs(groupedData[dateKey].forecastSales - groupedData[dateKey].actualSales) / groupedData[dateKey].forecastSales) * 100))
        : 0;
  });
  
  // Convert to array and sort by date
  return Object.values(groupedData).sort((a: any, b: any) => {
    const dateA = parseDate(a.name, timeFrame);
    const dateB = parseDate(b.name, timeFrame);
    return dateA.getTime() - dateB.getTime();
  });
};

// Format date label based on time frame
const formatDateLabel = (dateString: string, timeFrame: string) => {
  const date = new Date(dateString);
  
  switch(timeFrame) {
    case "daily":
      return `${date.getMonth() + 1}/${date.getDate()}`;
    case "weekly":
      return `Week ${Math.ceil(date.getDate() / 7)} - ${date.getMonth() + 1}/${date.getFullYear()}`;
    case "monthly":
      return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    case "quarterly":
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      return `Q${quarter} ${date.getFullYear()}`;
    case "yearly":
      return `${date.getFullYear()}`;
    default:
      return dateString;
  }
};

// Parse date from formatted label
const parseDate = (formattedDate: string, timeFrame: string) => {
  const currentDate = new Date();
  
  switch(timeFrame) {
    case "daily":
      const [month, day] = formattedDate.split('/').map(Number);
      return new Date(currentDate.getFullYear(), month - 1, day);
    case "weekly":
      return currentDate; // Simplified for example
    case "monthly":
      const [monthName, year] = formattedDate.split(' ');
      const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
      return new Date(Number(year), monthIndex, 1);
    case "quarterly":
      const [quarter, yearQ] = formattedDate.split(' ');
      const quarterNumber = parseInt(quarter.substring(1)) - 1;
      return new Date(Number(yearQ), quarterNumber * 3, 1);
    case "yearly":
      return new Date(Number(formattedDate), 0, 1);
    default:
      return new Date();
  }
};
