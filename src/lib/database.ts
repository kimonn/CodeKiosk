import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

export interface MainContent {
  id: string;
  type: 'text' | 'image' | 'video';
  title: string;
  content: string;
  mediaPath?: string;
  active: boolean;
  order: number;
  duration?: number; // Duration in seconds for cycling
  updatedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  active: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  content: string;
  dueDate: string;
  active: boolean;
}

export interface Deadline {
  id: string;
  title: string;
  content: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  active: boolean;
}

export interface ContentData {
  mainContent: MainContent[];
  news: NewsItem[];
  reminders: Reminder[];
  deadlines: Deadline[];
  logoPath?: string; // Add logo path to store the uploaded logo
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize content file if it doesn't exist
if (!fs.existsSync(CONTENT_FILE)) {
  const initialData: ContentData = {
    mainContent: [{
      id: 'main-1',
      type: 'text',
      title: 'Welcome to Digital Signage',
      content: 'This is the main content area. Upload images, videos, or text content through the admin panel.',
      mediaPath: '',
      active: true,
      order: 1,
      duration: 10,
      updatedAt: new Date().toISOString()
    }],
    news: [],
    reminders: [],
    deadlines: [],
    logoPath: '' // Initialize with empty logo path
  };
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(initialData, null, 2));
}

export const readContentData = (): ContentData => {
  try {
    const data = fs.readFileSync(CONTENT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading content data:', error);
    throw new Error('Failed to read content data');
  }
};

export const writeContentData = (data: ContentData): void => {
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing content data:', error);
    throw new Error('Failed to write content data');
  }
};

export const updateMainContent = (id: string, content: Partial<MainContent>): MainContent | null => {
  const data = readContentData();
  const index = data.mainContent.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  data.mainContent[index] = { ...data.mainContent[index], ...content, updatedAt: new Date().toISOString() };
  writeContentData(data);
  return data.mainContent[index];
};

export const addMainContent = (content: Omit<MainContent, 'id' | 'updatedAt'>): MainContent => {
  const data = readContentData();
  const newItem: MainContent = {
    ...content,
    id: `main-${Date.now()}`,
    updatedAt: new Date().toISOString()
  };
  data.mainContent.push(newItem);
  // Sort by order
  data.mainContent.sort((a, b) => a.order - b.order);
  writeContentData(data);
  return newItem;
};

export const deleteMainContent = (id: string): boolean => {
  const data = readContentData();
  const index = data.mainContent.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  data.mainContent.splice(index, 1);
  writeContentData(data);
  return true;
};

export const getActiveMainContent = (): MainContent[] => {
  const data = readContentData();
  return data.mainContent
    .filter(item => item.active)
    .sort((a, b) => a.order - b.order);
};

export const addNewsItem = (news: Omit<NewsItem, 'id'>): NewsItem => {
  const data = readContentData();
  const newItem: NewsItem = {
    ...news,
    id: `news-${Date.now()}`,
  };
  data.news.unshift(newItem);
  writeContentData(data);
  return newItem;
};

export const updateNewsItem = (id: string, updates: Partial<NewsItem>): NewsItem | null => {
  const data = readContentData();
  const index = data.news.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  data.news[index] = { ...data.news[index], ...updates };
  writeContentData(data);
  return data.news[index];
};

export const deleteNewsItem = (id: string): boolean => {
  const data = readContentData();
  const index = data.news.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  data.news.splice(index, 1);
  writeContentData(data);
  return true;
};

export const addReminder = (reminder: Omit<Reminder, 'id'>): Reminder => {
  const data = readContentData();
  const newItem: Reminder = {
    ...reminder,
    id: `reminder-${Date.now()}`,
  };
  data.reminders.unshift(newItem);
  writeContentData(data);
  return newItem;
};

export const updateReminder = (id: string, updates: Partial<Reminder>): Reminder | null => {
  const data = readContentData();
  const index = data.reminders.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  data.reminders[index] = { ...data.reminders[index], ...updates };
  writeContentData(data);
  return data.reminders[index];
};

export const deleteReminder = (id: string): boolean => {
  const data = readContentData();
  const index = data.reminders.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  data.reminders.splice(index, 1);
  writeContentData(data);
  return true;
};

export const addDeadline = (deadline: Omit<Deadline, 'id'>): Deadline => {
  const data = readContentData();
  const newItem: Deadline = {
    ...deadline,
    id: `deadline-${Date.now()}`,
  };
  data.deadlines.unshift(newItem);
  writeContentData(data);
  return newItem;
};

export const updateDeadline = (id: string, updates: Partial<Deadline>): Deadline | null => {
  const data = readContentData();
  const index = data.deadlines.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  data.deadlines[index] = { ...data.deadlines[index], ...updates };
  writeContentData(data);
  return data.deadlines[index];
};

export const deleteDeadline = (id: string): boolean => {
  const data = readContentData();
  const index = data.deadlines.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  data.deadlines.splice(index, 1);
  writeContentData(data);
  return true;
};

export const reorderMainContent = (itemIds: string[]): void => {
  const data = readContentData();
  
  // Create a map of id to current item for quick lookup
  const itemMap = new Map(data.mainContent.map(item => [item.id, item]));
  
  // Reorder items based on the new sequence
  data.mainContent = itemIds.map((id, index) => ({
    ...itemMap.get(id)!,
    order: index + 1
  }));
  
  writeContentData(data);
};

// Add function to update logo path
export const updateLogoPath = (logoPath: string): void => {
  const data = readContentData();
  data.logoPath = logoPath;
  writeContentData(data);
};

// Add function to get logo path
export const getLogoPath = (): string | undefined => {
  const data = readContentData();
  return data.logoPath;
};
