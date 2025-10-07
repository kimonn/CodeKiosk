import React, { useState } from 'react';
import { Upload, Edit3, Trash2, Plus, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import { MainContent, NewsItem, Reminder, Deadline } from '@/lib/database';

export interface EditingItem {
  type: string;
  item: any;
  isNew: boolean;
}

interface MainContentTabProps {
  content: MainContent[];
  onUpdate: (data: MainContent) => void;
  onFileUpload: (file: File, type: 'image' | 'video') => Promise<string | null>;
  uploading: boolean;
  editing: any;
  setEditing: (editing: any) => void;
  onSave: (type: string, data: Partial<MainContent>) => Promise<void>;
  onDelete: (type: string, id: string) => Promise<void>;
}

export function MainContentTab({ 
  content, 
  onUpdate, 
  onFileUpload, 
  uploading, 
  editing, 
  setEditing,
  onSave,
  onDelete
}: MainContentTabProps) {
  const handleAdd = () => {
    setEditing({
      type: 'main',
      item: {
        type: 'text' as const,
        title: '',
        content: '',
        mediaPath: '',
        active: true,
        order: (content?.length || 0) + 1,
        duration: 10
      } as Partial<MainContent>,
      isNew: true
    });
  };

  const handleEdit = (item: MainContent) => {
    setEditing({
      type: 'main',
      item: { ...item },
      isNew: false
    });
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    try {
      // Create a copy of the content and sort by current order
      const sortedContent = [...content].sort((a, b) => a.order - b.order);
      const currentIndex = sortedContent.findIndex(item => item.id === id);
      
      if (currentIndex === -1) return;
      
      // Move the item up or down in the array
      if (direction === 'up' && currentIndex > 0) {
        // Swap positions in the array
        [sortedContent[currentIndex], sortedContent[currentIndex - 1]] = 
          [sortedContent[currentIndex - 1], sortedContent[currentIndex]];
      } else if (direction === 'down' && currentIndex < sortedContent.length - 1) {
        // Swap positions in the array
        [sortedContent[currentIndex], sortedContent[currentIndex + 1]] = 
          [sortedContent[currentIndex + 1], sortedContent[currentIndex]];
      }
      
      // Extract the ordered IDs
      const itemIds = sortedContent.map(item => item.id);
      
      // Send the new order to the API
      const response = await fetch('/api/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds })
      });
      
      if (response.ok) {
        // Reload the page to reflect changes
        window.location.reload();
      } else {
        console.error('Failed to reorder items');
      }
    } catch (error) {
      console.error('Error reordering content:', error);
    }
  };  
  return (
    <div className="d-flex flex-column h-100" style={{gap: '1.5rem'}}>
      <div className="d-flex justify-content-between align-items-center flex-shrink-0">
        <div>
          <h2 className="h5 fw-medium text-dark mb-0">Main Content Items</h2>
        </div>
        <button
          onClick={handleAdd}
          className="btn btn-orange d-flex align-items-center"
        >
          <Plus className="me-2" size={16} />
          Add New Content
        </button>
      </div>

      <div className="bg-white shadow rounded-3 flex-grow-1 d-flex flex-column" style={{minHeight: 0}}>
        {!content || content.length === 0 ? (
          <div className="p-4 text-center text-muted">
            No main content items yet. Click &quot;Add New Content&quot; to create your first item.
          </div>
        ) : (
          <div className="overflow-auto custom-scrollbar" style={{maxHeight: 'calc(100vh - 200px)'}}>
            {(() => {
              const sortedContent = [...content].sort((a, b) => a.order - b.order);
              return sortedContent.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === sortedContent.length - 1;
                
                return (
                  <div 
                    key={item.id} 
                    className={`p-4 position-relative ${!isLast ? 'border-bottom' : ''}`}
                  >
                    {/* Content */}
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-2" style={{gap: '0.5rem'}}>
                          <span className="badge" style={{
                            backgroundColor: item.type === 'text' ? '#6c757d' : 
                                            item.type === 'image' ? '#28a745' : '#dc3545'
                          }}>
                            {item.type}
                          </span>
                          <span className={`badge ${
                            item.active ? 'bg-success' : 'bg-secondary'
                          }`}>
                            {item.active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="badge bg-info">
                            Order: {index + 1}
                          </span>
                          <span className="badge bg-warning text-dark">
                            Duration: {item.duration || 10}s
                          </span>
                        </div>
                        <h3 className="h6 fw-medium text-dark">{item.title}</h3>
                        {item.content && (
                          <p className="text-muted mb-2">{item.content}</p>
                        )}
                        {item.mediaPath && (
                          <div className="mt-2">
                            {item.type === 'image' ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={item.mediaPath} 
                                alt={item.title}
                                className="img-fluid rounded border"
                                style={{maxWidth: '200px', maxHeight: '120px', objectFit: 'contain'}}
                              />
                            ) : item.type === 'video' ? (
                              <video 
                                src={item.mediaPath}
                                controls
                                className="rounded border"
                                style={{maxWidth: '200px', maxHeight: '120px'}}
                              >
                                Your browser does not support the video tag.
                              </video>
                            ) : null}
                          </div>
                        )}
                      </div>
                      <div className="d-flex flex-column" style={{gap: '0.5rem'}}>
                        <div className="d-flex" style={{gap: '0.5rem'}}>
                          <button
                            onClick={() => handleEdit(item)}
                            className="btn btn-outline-primary btn-sm p-2"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => onDelete('main-content', item.id)}
                            className="btn btn-outline-danger btn-sm p-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="d-flex" style={{gap: '0.25rem'}}>
                          <button
                            onClick={() => handleReorder(item.id, 'up')}
                            disabled={isFirst}
                            className="btn btn-outline-secondary btn-sm p-2"
                            title="Move Up"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => handleReorder(item.id, 'down')}
                            disabled={isLast}
                            className="btn btn-outline-secondary btn-sm p-2"
                            title="Move Down"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

interface ItemsTabProps {
  title: string;
  items: Array<NewsItem | Reminder | Deadline>;
  type: string;
  editing: any;
  setEditing: (editing: any) => void;
  onSave: (type: string, data: any) => Promise<void>;
  onDelete: (type: string, id: string) => Promise<void>;
  fields: Array<{
    key: string;
    label: string;
    type: string;
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
  }>;
}

export function ItemsTab({ 
  title, 
  items, 
  type, 
  editing, 
  setEditing, 
  onSave, 
  onDelete, 
  fields 
}: ItemsTabProps) {
  const handleAdd = () => {
    const newItem: any = {};
    fields.forEach(field => {
      if (field.key === 'dueDate') {
        newItem[field.key] = new Date().toISOString().slice(0, 16);
      } else if (field.key === 'priority') {
        newItem[field.key] = 'medium';
      } else {
        newItem[field.key] = '';
      }
    });

    setEditing({
      type,
      item: newItem,
      isNew: true
    });
  };

  const handleEdit = (item: NewsItem | Reminder | Deadline) => {
    const editItem = { ...item };
    if ('dueDate' in editItem && editItem.dueDate) {
      editItem.dueDate = new Date(editItem.dueDate).toISOString().slice(0, 16);
    }

    setEditing({
      type,
      item: editItem,
      isNew: false
    });
  };

  return (
    <div className="d-flex flex-column h-100" style={{gap: '1.5rem'}}>
      <div className="d-flex justify-content-between align-items-center flex-shrink-0">
        <h2 className="h5 fw-medium text-dark mb-0">{title}</h2>
        <button
          onClick={handleAdd}
          className="btn btn-success d-flex align-items-center"
        >
          <Plus className="me-2" size={16} />
          Add New
        </button>
      </div>

      <div className="bg-white shadow rounded-3 flex-grow-1 d-flex flex-column" style={{minHeight: 0}}>
        {items.length === 0 ? (
          <div className="p-4 text-center text-muted">
            No items yet. Click &quot;Add New&quot; to create your first item.
          </div>
        ) : (
          <div className="overflow-auto custom-scrollbar" style={{maxHeight: 'calc(100vh - 200px)'}}>
            {items.map((item, index) => (
              <div key={'id' in item ? item.id : index} className={`p-4 ${index !== items.length - 1 ? 'border-bottom' : ''}`}>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2" style={{gap: '0.5rem'}}>
                      <h3 className="h6 fw-medium text-dark mb-0">{item.title}</h3>
                      <span className={`badge ${
                        'active' in item && item.active ? 'bg-success' : 'bg-secondary'
                      }`}>
                        {'active' in item && item.active ? 'Active' : 'Inactive'}
                      </span>
                      {'priority' in item && item.priority && (
                        <span className={`badge ${
                          item.priority === 'high' ? 'bg-danger' :
                          item.priority === 'medium' ? 'bg-warning' :
                          'bg-info'
                        }`}>
                          {item.priority} priority
                        </span>
                      )}
                    </div>
                    <p className="text-muted mb-2">{item.content}</p>
                    {'dueDate' in item && item.dueDate && (
                      <p className="small text-muted mb-0">
                        Due: {new Date(item.dueDate).toLocaleString()}
                      </p>
                    )}
                    {'publishedAt' in item && item.publishedAt && (
                      <p className="small text-muted mb-0">
                        Published: {new Date(item.publishedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="d-flex" style={{gap: '0.5rem'}}>
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn btn-outline-primary btn-sm p-2"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(type, 'id' in item ? item.id : '')}
                      className="btn btn-outline-danger btn-sm p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface EditModalProps {
  editing: EditingItem;
  setEditing: (editing: EditingItem | null) => void;
  onSave: (type: string, data: any) => Promise<void>;
  onFileUpload: (file: File, type: 'image' | 'video') => Promise<string | null>;
  uploading: boolean;
}

interface FormField {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export function EditModal({ editing, setEditing, onSave, onFileUpload, uploading }: EditModalProps) {
  const [formData, setFormData] = useState(editing.item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editing.type === 'main') {
      onSave('main', formData);
    } else {
      const saveData = { ...formData };
      if (saveData.dueDate) {
        saveData.dueDate = new Date(saveData.dueDate).toISOString();
      }
      onSave(editing.type, saveData);
    }
  };

  const handleFileUploadForMain = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }

    const url = await onFileUpload(file, isImage ? 'image' : 'video');
    if (url) {
      setFormData({
        ...formData,
        type: isImage ? 'image' : 'video',
        mediaPath: url
      });
    }
  };

  const getFields = (): FormField[] => {
    if (editing.type === 'main') {
      return [
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'content', label: 'Content', type: 'textarea', required: false },
        { 
          key: 'type', 
          label: 'Content Type', 
          type: 'select', 
          options: [
            { value: 'text', label: 'Text Only' },
            { value: 'image', label: 'Image' },
            { value: 'video', label: 'Video' }
          ]
        },
        { key: 'order', label: 'Display Order', type: 'number', required: true },
        { key: 'duration', label: 'Duration (seconds)', type: 'number', required: true },
        { key: 'active', label: 'Active', type: 'checkbox' }
      ];
    }

    const fieldMaps: Record<string, FormField[]> = {
      news: [
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'content', label: 'Content', type: 'textarea', required: true },
        { key: 'active', label: 'Active', type: 'checkbox' }
      ],
      reminders: [
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'content', label: 'Content', type: 'textarea', required: true },
        { key: 'dueDate', label: 'Due Date', type: 'datetime-local', required: true },
        { key: 'active', label: 'Active', type: 'checkbox' }
      ],
      deadlines: [
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
        },
        { key: 'active', label: 'Active', type: 'checkbox' }
      ]
    };

    return fieldMaps[editing.type] || [];
  };

  return (
    <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editing.isNew ? 'Add New' : 'Edit'} {editing.type === 'main' ? 'Main Content' : editing.type}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setEditing(null)}
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {getFields().map((field) => (
                <div key={field.key} className="mb-3">
                  <label className="form-label">
                    {field.label}
                    {field.required && <span className="text-danger ms-1">*</span>}
                  </label>
                  
                  {field.type === 'text' && (
                    <input
                      type="text"
                      required={field.required}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="form-control"
                    />
                  )}
                  
                  {field.type === 'number' && (
                    <input
                      type="number"
                      required={field.required}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: parseInt(e.target.value) || 0 })}
                      className="form-control"
                      min={field.key === 'order' ? '1' : field.key === 'duration' ? '1' : '0'}
                    />
                  )}
                  
                  {field.type === 'textarea' && (
                    <textarea
                      required={field.required}
                      rows={3}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="form-control"
                    />
                  )}
                  
                  {field.type === 'datetime-local' && (
                    <input
                      type="datetime-local"
                      required={field.required}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="form-control"
                    />
                  )}
                  
                  {field.type === 'select' && field.options && (
                    <select
                      required={field.required}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="form-select"
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {field.type === 'checkbox' && (
                    <div className="form-check">
                      <input
                        type="checkbox"
                        checked={formData[field.key] ?? true}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                        className="form-check-input"
                        id={field.key}
                      />
                      <label className="form-check-label" htmlFor={field.key}>
                        {field.key === 'active' ? 'Show on display' : field.label}
                      </label>
                    </div>
                  )}
                </div>
              ))}

              {editing.type === 'main' && (formData.type === 'image' || formData.type === 'video') && (
                <div className="mb-3">
                  <label className="form-label">
                    Upload {formData.type === 'image' ? 'Image' : 'Video'}
                  </label>
                  <input
                    type="file"
                    accept={formData.type === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleFileUploadForMain}
                    disabled={uploading}
                    className="form-control"
                  />
                  {uploading && <div className="form-text text-primary">Uploading...</div>}
                  
                  {formData.mediaPath && (
                    <div className="mt-2">
                      <p className="form-text">Current file:</p>
                      {formData.type === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={formData.mediaPath} 
                          alt="Preview"
                          className="img-fluid border rounded"
                          style={{maxWidth: '300px', maxHeight: '200px', objectFit: 'contain'}}
                        />
                      ) : (
                        <video 
                          src={formData.mediaPath}
                          controls
                          className="border rounded"
                          style={{maxWidth: '300px', maxHeight: '200px'}}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit as any}
              className="btn btn-blue d-flex align-items-center"
            >
              <Save className="me-2" size={16} />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}