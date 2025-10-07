'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, 
  FileText, 
  Megaphone, 
  Bell, 
  Calendar
} from 'lucide-react';
import { ContentData, MainContent, NewsItem, Reminder, Deadline } from '@/lib/database';
import { MainContentTab, ItemsTab, EditModal, EditingItem } from './components';

type TabType = 'main' | 'news' | 'reminders' | 'deadlines';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('main');
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<EditingItem | null>(null);

  // Fetch content data
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const data: ContentData = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'image' | 'video') => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.url;
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const updateMainContent = async (data: Partial<MainContent>) => {
    try {
      const response = await fetch('/api/main-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchContent();
        setEditing(null);
      }
    } catch (error) {
      console.error('Error updating main content:', error);
    }
  };

  const handleItemSave = async (type: string, data: any) => {
    try {
      const endpoint = `/api/${type === 'main' ? 'main-content' : type}`;
      const method = editing?.isNew ? 'POST' : 'PUT';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchContent();
        setEditing(null);
      }
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
    }
  };

  const handleItemDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const endpoint = type === 'main-content' ? '/api/main-content' : `/api/${type}`;
      const response = await fetch(`${endpoint}?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchContent();
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{backgroundColor: '#f8f9fa'}}>
        <div className="h4 fw-semibold text-muted">Loading Admin Panel...</div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column" style={{backgroundColor: '#f8f9fa'}}>
      {/* Header */}
      <header className="bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <div className="row justify-content-between align-items-center py-3">
            <div className="col-auto">
              <h1 className="h3 fw-bold text-dark mb-0">Digital Signage Admin</h1>
            </div>
            <div className="col-auto">
              <Link
                href="/"
                className="btn btn-blue text-decoration-none d-flex align-items-center"
              >
                <Home className="me-2" size={16} />
                View Display
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container-fluid">
          <div className="d-flex" style={{gap: '2rem'}}>
            {[
              { id: 'main', label: 'Main Content', icon: FileText },
              { id: 'news', label: 'News & Announcements', icon: Megaphone },
              { id: 'reminders', label: 'Reminders', icon: Bell },
              { id: 'deadlines', label: 'Deadlines', icon: Calendar }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as TabType)}
                className={`btn border-0 d-flex align-items-center py-3 px-1 border-bottom border-2 fw-medium ${
                  activeTab === id
                    ? 'border-orange orange-accent'
                    : 'border-transparent text-muted'
                }`}
                style={{backgroundColor: 'transparent'}}
              >
                <Icon className="me-2" size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container-fluid py-4 flex-grow-1 d-flex flex-column" style={{minHeight: 0}}>
        <div className="px-3 h-100 d-flex flex-column">
          {activeTab === 'main' && (
            <div className="h-100 d-flex flex-column">
              <MainContentTab
                content={content?.mainContent || []}
                onUpdate={updateMainContent}
                onFileUpload={handleFileUpload}
                uploading={uploading}
                editing={editing}
                setEditing={setEditing}
                onSave={handleItemSave}
                onDelete={handleItemDelete}
              />
            </div>
          )}

          {activeTab === 'news' && (
            <div className="h-100 d-flex flex-column">
              <ItemsTab
              title="News & Announcements"
              items={content?.news || []}
              type="news"
              editing={editing}
              setEditing={setEditing}
              onSave={handleItemSave}
              onDelete={handleItemDelete}
              fields={[
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'content', label: 'Content', type: 'textarea', required: true }
              ]}
            />
          </div>
          )}

          {activeTab === 'reminders' && (
            <div className="h-100 d-flex flex-column">
              <ItemsTab
              title="Reminders"
              items={content?.reminders || []}
              type="reminders"
              editing={editing}
              setEditing={setEditing}
              onSave={handleItemSave}
              onDelete={handleItemDelete}
              fields={[
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'content', label: 'Content', type: 'textarea', required: true },
                { key: 'dueDate', label: 'Due Date', type: 'datetime-local', required: true }
              ]}
            />
          </div>
          )}

          {activeTab === 'deadlines' && (
            <div className="h-100 d-flex flex-column">
              <ItemsTab
              title="Deadlines"
              items={content?.deadlines || []}
              type="deadlines"
              editing={editing}
              setEditing={setEditing}
              onSave={handleItemSave}
              onDelete={handleItemDelete}
              fields={[
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'content', label: 'Content', type: 'textarea', required: true },
                { key: 'dueDate', label: 'Due Date', type: 'datetime-local', required: true },
                { 
                  key: 'priority', 
                  label: 'Priority', 
                  type: 'select', 
                  options: [
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' }
                  ]
                }
              ]}
            />
          </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editing && (
        <EditModal
          editing={editing}
          setEditing={setEditing}
          onSave={handleItemSave}
          onFileUpload={handleFileUpload}
          uploading={uploading}
        />
      )}
    </div>
  );
}