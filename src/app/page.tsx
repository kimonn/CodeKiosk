'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Settings, Megaphone, Bell, Calendar } from 'lucide-react';
import { ContentData } from '@/lib/database';

export default function DigitalSignage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);
  const [currentDeadlineIndex, setCurrentDeadlineIndex] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Handle user interaction to enable autoplay with sound
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch content data (including logo)
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
    
    // Refresh content every 30 seconds
    const contentTimer = setInterval(fetchContent, 30000);
    return () => clearInterval(contentTimer);
  }, []);

  // Reset video state when content changes
  useEffect(() => {
    if (content?.mainContent) {
      const activeMainContent = content.mainContent.filter(item => item.active).sort((a, b) => a.order - b.order);
      const currentItem = activeMainContent[currentContentIndex];
      
      if (currentItem?.type !== 'video') {
        setVideoDuration(null);
        setVideoEnded(false);
      }
    }
  }, [currentContentIndex, content]);

  // Cycle through news items
  useEffect(() => {
    const activeNews = content?.news.filter(item => item.active) || [];
    if (activeNews.length <= 1) return;

    const newsTimer = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => 
        (prevIndex + 1) % activeNews.length
      );
    }, 8000); // 8 seconds per news item

    return () => clearInterval(newsTimer);
  }, [content]);

  // Cycle through reminder items
  useEffect(() => {
    const activeReminders = content?.reminders.filter(item => item.active) || [];
    if (activeReminders.length <= 1) return;

    const reminderTimer = setInterval(() => {
      setCurrentReminderIndex((prevIndex) => 
        (prevIndex + 1) % activeReminders.length
      );
    }, 7000); // 7 seconds per reminder item

    return () => clearInterval(reminderTimer);
  }, [content]);

  // Cycle through deadline items
  useEffect(() => {
    const activeDeadlines = content?.deadlines.filter(item => item.active) || [];
    if (activeDeadlines.length <= 1) return;

    const deadlineTimer = setInterval(() => {
      setCurrentDeadlineIndex((prevIndex) => 
        (prevIndex + 1) % activeDeadlines.length
      );
    }, 6000); // 6 seconds per deadline item

    return () => clearInterval(deadlineTimer);
  }, [content]);

  // Cycle through main content
  useEffect(() => {
    if (!content?.mainContent || content.mainContent.length <= 1) return;

    const activeMainContent = content.mainContent.filter(item => item.active).sort((a, b) => a.order - b.order);
    if (activeMainContent.length <= 1) return;

    const currentItem = activeMainContent[currentContentIndex];
    
    // For video content, wait for video to end or use video duration
    if (currentItem?.type === 'video') {
      if (videoDuration && !videoEnded) {
        const cycleTimer = setTimeout(() => {
          setCurrentContentIndex((prevIndex) => 
            (prevIndex + 1) % activeMainContent.length
          );
          setVideoEnded(false);
        }, videoDuration * 1000);
        return () => clearTimeout(cycleTimer);
      } else if (videoEnded) {
        // Video ended, immediately go to next content
        setCurrentContentIndex((prevIndex) => 
          (prevIndex + 1) % activeMainContent.length
        );
        setVideoEnded(false);
        return;
      }
    } else {
      // For non-video content, use configured duration
      const duration = (currentItem?.duration || 10) * 1000;
      const cycleTimer = setInterval(() => {
        setCurrentContentIndex((prevIndex) => 
          (prevIndex + 1) % activeMainContent.length
        );
      }, duration);
      return () => clearInterval(cycleTimer);
    }
  }, [content, currentContentIndex, videoDuration, videoEnded]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  const activeNews = content?.news.filter(item => item.active) || [];
  const activeReminders = content?.reminders.filter(item => item.active) || [];
  const activeDeadlines = content?.deadlines.filter(item => item.active).sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  ) || [];

  // Get current main content item
  const activeMainContent = content?.mainContent?.filter(item => item.active).sort((a, b) => a.order - b.order) || [];
  const currentMainContent = activeMainContent[currentContentIndex] || activeMainContent[0];

  // Get current news item
  const currentNewsItem = activeNews[currentNewsIndex] || activeNews[0];

  // Get current reminder item
  const currentReminderItem = activeReminders[currentReminderIndex] || activeReminders[0];

  // Get current deadline item
  const currentDeadlineItem = activeDeadlines[currentDeadlineIndex] || activeDeadlines[0];

  return (
    <div className="h-100vh d-flex position-relative" style={{background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 25%, #bfdbfe 50%, #93c5fd 75%, #e0f2fe 100%)', height: '100vh', overflow: 'hidden'}}>
      {/* Admin Button */}
      <Link 
        href="/admin" 
        className="position-absolute top-0 end-0 m-4 btn btn-light rounded-circle p-3 modern-shadow text-decoration-none"
        style={{zIndex: 50, transition: 'all 0.3s ease'}}
        title="Admin Panel"
      >
        <Settings size={20} />
      </Link>

      {/* Left Column */}
      <div className="d-flex flex-column p-2" style={{flex: '1', minHeight: '100vh', gap: '0.75rem'}}>
        {/* Main Content Area */}
        <div className="content-card modern-shadow p-3 position-relative overflow-hidden" style={{height: 'calc(66.666vh - 1rem)', minHeight: 'calc(66.666vh - 1rem)', maxHeight: 'calc(66.666vh - 1rem)', border: '3px solid #fbbf24'}}>
          <MainContentDisplay 
            content={currentMainContent} 
            onVideoDurationChange={setVideoDuration}
            onVideoEnded={() => setVideoEnded(true)}
            hasUserInteracted={hasUserInteracted}
          />
          {/* Decorative elements */}
          <div className="position-absolute" style={{top: '1rem', right: '1rem', width: '12px', height: '12px', backgroundColor: '#2dd4bf', borderRadius: '50%', opacity: 0.6}}></div>
          <div className="position-absolute" style={{top: '2rem', right: '2rem', width: '8px', height: '8px', backgroundColor: '#0ea5e9', borderRadius: '50%', opacity: 0.4}}></div>
          
          {/* Content indicator dots */}
          {activeMainContent.length > 1 && (
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
              <div className="d-flex" style={{gap: '0.5rem'}}>
                {activeMainContent.map((_, index) => (
                  <div
                    key={index}
                    className="rounded-circle"
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: index === currentContentIndex ? '#1e6b7b' : 'rgba(30, 107, 123, 0.3)',
                      transition: 'background-color 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* News and Announcements */}
        <div className="content-card modern-shadow p-3 overflow-hidden" style={{height: 'calc(33.333vh - 0.5rem)', minHeight: 'calc(33.333vh - 0.5rem)', maxHeight: 'calc(33.333vh - 0.5rem)', border: '3px solid #f97316'}}>
          <div className="d-flex align-items-center mb-4">
            <div className="me-3" style={{width: '4px', height: '2rem', background: 'linear-gradient(to bottom, #f97316, #ea580c)', borderRadius: '2px'}}></div>
            <h2 className="h3 fw-bold text-dark headline-text mb-0">
              NEWS & ANNOUNCEMENTS
            </h2>
            {activeNews.length > 1 && (
              <div className="ms-auto d-flex align-items-center" style={{gap: '0.5rem'}}>
                <span className="small text-muted">{currentNewsIndex + 1} of {activeNews.length}</span>
              </div>
            )}
          </div>
          <div className="h-100 d-flex align-items-center" style={{minHeight: 'calc(100% - 60px)', maxHeight: 'calc(100% - 60px)', overflow: 'hidden'}}>
            {activeNews.length > 0 && currentNewsItem ? (
              <div className="w-100 slide-up" 
                   style={{
                     background: 'linear-gradient(to right, #eff6ff, #dbeafe)',
                     padding: '1.5rem',
                     borderRadius: '12px',
                     borderLeft: '4px solid #1e3a8a',
                     animation: 'slideIn 0.5s ease-in-out'
                   }}>
                <h3 className="fw-bold text-dark h4 headline-text mb-3">{currentNewsItem.title}</h3>
                <p className="text-muted body-text mb-3 lh-lg">{currentNewsItem.content}</p>
                <div className="d-flex align-items-center justify-content-between">
                  <p className="small orange-accent fw-semibold mb-0">
                    {format(new Date(currentNewsItem.publishedAt), 'MMM dd, yyyy • HH:mm')}
                  </p>
                  {activeNews.length > 1 && (
                    <div className="d-flex" style={{gap: '0.25rem'}}>
                      {activeNews.map((_, index) => (
                        <div
                          key={index}
                          className="rounded-circle"
                          style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: index === currentNewsIndex ? '#1e3a8a' : 'rgba(30, 58, 138, 0.3)',
                            transition: 'background-color 0.3s ease'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-5 w-100">
                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" 
                     style={{width: '4rem', height: '4rem', backgroundColor: '#f0fdfa'}}>
                  <Megaphone className="text-teal" size={32} />
                </div>
                <p className="text-muted body-text">No announcements at this time</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="d-flex flex-column p-2" style={{width: '33.333%', minWidth: '33.333%', maxWidth: '33.333%', height: '100vh', maxHeight: '100vh', gap: '0.75rem', overflow: 'hidden', boxSizing: 'border-box'}}>
        {/* Date and Time */}
        <div className="blue-gradient rounded-4 modern-shadow p-3 text-white d-flex position-relative overflow-hidden" style={{height: 'calc(25vh - 1rem)', minHeight: 'calc(25vh - 1rem)', maxHeight: 'calc(25vh - 1rem)', border: '3px solid #10b981'}}>
          {/* Background decorative elements */}
          <div className="position-absolute" style={{top: 0, right: 0, width: '8rem', height: '8rem', backgroundColor: 'rgba(251, 146, 60, 0.2)', borderRadius: '50%', transform: 'translate(4rem, -4rem)'}}></div>
          <div className="position-absolute" style={{bottom: 0, left: 0, width: '6rem', height: '6rem', backgroundColor: 'rgba(251, 146, 60, 0.15)', borderRadius: '50%', transform: 'translate(-3rem, 3rem)'}}></div>
          
          {/* Logo on the left side */}
          {content?.logoPath && (
            <div className="d-flex align-items-center justify-content-start ps-2" style={{width: '40%', minWidth: '120px'}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={content.logoPath} 
                alt="Logo" 
                className="img-fluid"
                style={{maxHeight: '100px', maxWidth: '100%', objectFit: 'contain'}}
              />
            </div>
          )}
          
          {/* Date/Time Content - moved closer to logo */}
          <div className="d-flex flex-column justify-content-center align-items-start flex-grow-1 position-relative ps-3" style={{zIndex: 10}}>
            <div className="headline-text mb-2" style={{fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '-0.025em'}}>
              {format(currentTime, 'HH:mm')}
            </div>
            <div className="small fw-medium mb-2" style={{opacity: 0.9}}>
              {format(currentTime, 'ss')} seconds
            </div>
            <div className="h6 fw-semibold mb-1 headline-text">
              {format(currentTime, 'EEEE')}
            </div>
            <div className="small body-text" style={{opacity: 0.9}}>
              {format(currentTime, 'MMMM dd, yyyy')}
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="content-card modern-shadow p-3 overflow-hidden" style={{height: 'calc(41.667vh - 1rem)', minHeight: 'calc(41.667vh - 1rem)', maxHeight: 'calc(41.667vh - 1rem)', border: '3px solid #3b82f6'}}>
          <div className="d-flex align-items-center mb-4">
            <div className="me-3" style={{width: '4px', height: '2rem', background: 'linear-gradient(to bottom, #10b981, #059669)', borderRadius: '2px'}}></div>
            <h2 className="h5 fw-bold text-dark headline-text mb-0">
              REMINDERS
            </h2>
            {activeReminders.length > 1 && (
              <div className="ms-auto d-flex align-items-center" style={{gap: '0.5rem'}}>
                <span className="small text-muted">{currentReminderIndex + 1} of {activeReminders.length}</span>
              </div>
            )}
          </div>
          <div className="h-100 d-flex align-items-center" style={{minHeight: 'calc(100% - 60px)', maxHeight: 'calc(100% - 60px)', overflow: 'hidden'}}>
            {activeReminders.length > 0 && currentReminderItem ? (
              <div className="w-100 slide-up" 
                   style={{
                     background: 'linear-gradient(to right, #f0fdf4, #dcfce7)',
                     padding: '1.5rem',
                     borderRadius: '12px',
                     borderLeft: '4px solid #10b981',
                     animation: 'slideIn 0.5s ease-in-out'
                   }}>
                <h3 className="fw-bold text-dark h5 headline-text mb-3">{currentReminderItem.title}</h3>
                <p className="text-muted body-text mb-3 lh-lg">{currentReminderItem.content}</p>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="me-2" style={{width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%'}}></div>
                    <p className="small fw-semibold mb-0" style={{color: '#059669'}}>
                      Due: {format(new Date(currentReminderItem.dueDate), 'MMM dd • HH:mm')}
                    </p>
                  </div>
                  {activeReminders.length > 1 && (
                    <div className="d-flex" style={{gap: '0.25rem'}}>
                      {activeReminders.map((_, index) => (
                        <div
                          key={index}
                          className="rounded-circle"
                          style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: index === currentReminderIndex ? '#10b981' : 'rgba(16, 185, 129, 0.3)',
                            transition: 'background-color 0.3s ease'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 w-100">
                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" 
                     style={{width: '3rem', height: '3rem', backgroundColor: '#f0fdf4'}}>
                  <Bell className="text-success" size={24} />
                </div>
                <p className="text-muted body-text small">No reminders</p>
              </div>
            )}
          </div>
        </div>

        {/* Deadlines */}
        <div className="content-card modern-shadow p-3 overflow-hidden" style={{height: 'calc(33.333vh - 1rem)', minHeight: 'calc(33.333vh - 1rem)', maxHeight: 'calc(33.333vh - 1rem)', background: 'linear-gradient(135deg, rgba(30, 107, 123, 0.1) 0%, rgba(19, 78, 74, 0.1) 100%)', border: '3px solid #ef4444'}}>
          <div className="d-flex align-items-center mb-4">
            <div className="me-3" style={{width: '4px', height: '2rem', background: 'linear-gradient(to bottom, #ef4444, #dc2626)', borderRadius: '2px'}}></div>
            <h2 className="h5 fw-bold text-dark headline-text mb-0">
              DEADLINES
            </h2>
            {activeDeadlines.length > 1 && (
              <div className="ms-auto d-flex align-items-center" style={{gap: '0.5rem'}}>
                <span className="small text-muted">{currentDeadlineIndex + 1} of {activeDeadlines.length}</span>
              </div>
            )}
          </div>
          <div className="h-100 d-flex align-items-center" style={{minHeight: 'calc(100% - 60px)', maxHeight: 'calc(100% - 60px)', overflow: 'hidden'}}>
            {activeDeadlines.length > 0 && currentDeadlineItem ? (
              (() => {
                const isUrgent = new Date(currentDeadlineItem.dueDate).getTime() - Date.now() < 24 * 60 * 60 * 1000;
                const priorityConfig = {
                  high: { bg: 'linear-gradient(to right, #fef2f2, #fce7e6)', border: '#ef4444', text: '#991b1b', dot: '#ef4444' },
                  medium: { bg: 'linear-gradient(to right, #fffbeb, #fef3c7)', border: '#f59e0b', text: '#92400e', dot: '#f59e0b' },
                  low: { bg: 'linear-gradient(to right, #eff6ff, #dbeafe)', border: '#3b82f6', text: '#1e40af', dot: '#3b82f6' }
                };
                const config = priorityConfig[currentDeadlineItem.priority as keyof typeof priorityConfig];
                
                return (
                  <div className="w-100 slide-up" 
                       style={{
                         background: isUrgent ? 'linear-gradient(to right, #fee2e2, #fecaca)' : config.bg,
                         padding: '1.5rem',
                         borderRadius: '12px',
                         borderLeft: `4px solid ${isUrgent ? '#ef4444' : config.border}`,
                         animation: 'slideIn 0.5s ease-in-out'
                       }}>
                    <h3 className={`fw-bold headline-text h5 mb-3`} style={{color: isUrgent ? '#991b1b' : config.text}}>
                      {currentDeadlineItem.title}
                    </h3>
                    <p className={`body-text mb-3 lh-lg`} style={{color: isUrgent ? '#7f1d1d' : '#6b7280'}}>
                      {currentDeadlineItem.content}
                    </p>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="me-2" style={{
                          width: '8px', 
                          height: '8px', 
                          backgroundColor: isUrgent ? '#ef4444' : config.dot, 
                          borderRadius: '50%'
                        }}></div>
                        <p className="small fw-semibold mb-0" style={{color: isUrgent ? '#7f1d1d' : config.text}}>
                          {format(new Date(currentDeadlineItem.dueDate), 'MMM dd • HH:mm')}
                        </p>
                        {isUrgent && (
                          <span className="badge bg-danger small fw-bold ms-2">
                            URGENT
                          </span>
                        )}
                      </div>
                      {activeDeadlines.length > 1 && (
                        <div className="d-flex" style={{gap: '0.25rem'}}>
                          {activeDeadlines.map((_, index) => (
                            <div
                              key={index}
                              className="rounded-circle"
                              style={{
                                width: '6px',
                                height: '6px',
                                backgroundColor: index === currentDeadlineIndex ? (isUrgent ? '#ef4444' : config.dot) : `rgba(${isUrgent ? '239, 68, 68' : config.dot === '#ef4444' ? '239, 68, 68' : config.dot === '#f59e0b' ? '245, 158, 11' : '59, 130, 246'}, 0.3)`,
                                transition: 'background-color 0.3s ease'
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-4 w-100">
                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" 
                     style={{width: '3rem', height: '3rem', backgroundColor: '#fee2e2'}}>
                  <Calendar className="text-danger" size={24} />
                </div>
                <p className="text-muted body-text small">No deadlines</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Content Display Component
function MainContentDisplay({ 
  content, 
  onVideoDurationChange, 
  onVideoEnded,
  hasUserInteracted 
}: { 
  content?: any;
  onVideoDurationChange?: (duration: number) => void;
  onVideoEnded?: () => void;
  hasUserInteracted?: boolean;
}) {
  if (!content) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle" 
               style={{width: '5rem', height: '5rem', backgroundColor: '#f0fdfa'}}>
            <div className="bg-teal rounded-3" style={{width: '2.5rem', height: '2.5rem'}}></div>
          </div>
          <p className="text-muted h5 body-text">No content available</p>
        </div>
      </div>
    );
  }

  if (content.type === 'image' && content.mediaPath) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center overflow-hidden rounded-4 p-4" 
           style={{background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)'}}>
        <img 
          src={content.mediaPath} 
          alt={content.title}
          className="img-fluid rounded-3 shadow-lg"
          style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}}
        />
      </div>
    );
  }

  if (content.type === 'video' && content.mediaPath) {
    return (
      <div className="h-100 w-100 d-flex align-items-center justify-content-center position-relative overflow-hidden" 
           style={{background: '#000'}}>
        {!hasUserInteracted && (
          <div 
            className="position-absolute top-50 start-50 translate-middle bg-light rounded-3 p-4 text-center" 
            style={{zIndex: 10, cursor: 'pointer'}}
            onClick={() => {
              const video = document.querySelector('video') as HTMLVideoElement;
              if (video) {
                video.muted = false;
                video.play().catch(console.error);
              }
            }}
          >
            <div className="mb-2">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </div>
            <p className="mb-0 fw-medium">Click to play with sound</p>
          </div>
        )}
        <video 
          src={content.mediaPath}
          autoPlay
          controls
          muted={!hasUserInteracted}
          playsInline
          className="h-100 w-100"
          style={{objectFit: 'contain'}}
          onLoadedMetadata={(e) => {
            const video = e.target as HTMLVideoElement;
            if (onVideoDurationChange && video.duration) {
              onVideoDurationChange(video.duration);
            }
          }}
          onLoadedData={(e) => {
            // Try to play video
            const video = e.target as HTMLVideoElement;
            if (hasUserInteracted) {
              video.muted = false;
            }
            video.play().catch((error) => {
              console.warn('Autoplay failed:', error);
              // This is expected for unmuted videos without user interaction
            });
          }}
          onEnded={() => {
            if (onVideoEnded) {
              onVideoEnded();
            }
          }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Default text content - simplified without header and placeholder
  return (
    <div className="h-100 d-flex align-items-center justify-content-center position-relative overflow-hidden">
      {/* Background pattern */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{opacity: 0.05}}>
        <div className="position-absolute teal-gradient rounded-circle" 
             style={{top: '2.5rem', left: '2.5rem', width: '8rem', height: '8rem'}}></div>
        <div className="position-absolute rounded-circle" 
             style={{bottom: '5rem', right: '5rem', width: '6rem', height: '6rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'}}></div>
        <div className="position-absolute rounded-circle" 
             style={{top: '50%', right: '2.5rem', width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #10b981, #059669)'}}></div>
      </div>
      
      <div className="position-relative text-center" style={{zIndex: 10}}>
        <div className="headline-text text-dark lh-1 mb-4" style={{fontSize: '5rem', fontWeight: 'bold'}}>
          {content.title}
        </div>
        {content.content && (
          <div>
            <p className="h5 text-muted body-text lh-lg mb-4">
              {content.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}