import React, { useState, useEffect } from 'react';
import './SearchCalendar.css';

const SearchCalendar = ({ isOpen, onClose, onSelectDates }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Default to July 2026 based on screenshot
  const [selection, setSelection] = useState({ startDate: null, endDate: null });
  const [hoverDate, setHoverDate] = useState(null);
  const [activeTab, setActiveTab] = useState('Dates');
  const [flexibleDays, setFlexibleDays] = useState('Exact dates');

  useEffect(() => {
    // Reset to current month in real world, but screenshot is July 2026
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }, []);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleDateClick = (date) => {
    if (!selection.startDate || (selection.startDate && selection.endDate)) {
      setSelection({ startDate: date, endDate: null });
    } else if (date < selection.startDate) {
      setSelection({ startDate: date, endDate: null });
    } else {
      setSelection({ ...selection, endDate: date });
      // Notify parent about complete selection
      if (onSelectDates) {
        onSelectDates(selection.startDate, date);
      }
    }
  };

  const handleMouseEnter = (date) => {
    setHoverDate(date);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderMonth = (year, month, label) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isPast = date < today;
      let className = "calendar-day";
      
      const isStart = selection.startDate && date.getTime() === selection.startDate.getTime();
      const isEnd = selection.endDate && date.getTime() === selection.endDate.getTime();
      const isBetween = selection.startDate && selection.endDate && date > selection.startDate && date < selection.endDate;
      const isHoverBetween = selection.startDate && !selection.endDate && hoverDate && date > selection.startDate && date <= hoverDate;

      if (isStart || isEnd) className += " selected";
      else if (isBetween || isHoverBetween) className += " in-range";
      if (isPast) className += " disabled";

      days.push(
        <div 
          key={i} 
          className={className}
          onClick={() => !isPast && handleDateClick(date)}
          onMouseEnter={() => !isPast && handleMouseEnter(date)}
        >
          <span>{i}</span>
        </div>
      );
    }

    return (
      <div className="calendar-month">
        <h3 className="month-title">{label}</h3>
        <div className="weekdays">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>
        <div className="days-grid">
          {days}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const currentYear = currentDate.getFullYear();
  const currentMonthIdx = currentDate.getMonth();
  
  let nextYear = currentYear;
  let nextMonthIdx = currentMonthIdx + 1;
  if (nextMonthIdx > 11) {
    nextMonthIdx = 0;
    nextYear++;
  }

  const pills = ["Exact dates", "± 1 day", "± 2 days", "± 3 days", "± 7 days", "± 14 days"];

  return (
    <div className="search-calendar-popup">
      <div className="calendar-tabs">
        <button 
          className={`tab-btn ${activeTab === 'Dates' ? 'active' : ''}`}
          onClick={() => setActiveTab('Dates')}
        >
          Dates
        </button>
        <button 
          className={`tab-btn ${activeTab === 'Flexible' ? 'active' : ''}`}
          onClick={() => setActiveTab('Flexible')}
        >
          Flexible
        </button>
      </div>

      <div className="calendar-container">
        <button className="nav-arrow left" onClick={prevMonth}>
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentColor', strokeWidth: 4, overflow: 'visible' }}><g fill="none"><path d="m20 28-11.29289322-11.2928932c-.39052429-.3905243-.39052429-1.0236893 0-1.4142136l11.29289322-11.2928932"></path></g></svg>
        </button>
        
        <div className="months-wrapper">
          {renderMonth(currentYear, currentMonthIdx, `${monthNames[currentMonthIdx]} ${currentYear}`)}
          {renderMonth(nextYear, nextMonthIdx, `${monthNames[nextMonthIdx]} ${nextYear}`)}
        </div>

        <button className="nav-arrow right" onClick={nextMonth}>
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentColor', strokeWidth: 4, overflow: 'visible' }}><g fill="none"><path d="m12 4 11.2928932 11.2928932c.3905243.3905243.3905243 1.0236893 0 1.4142136l-11.2928932 11.2928932"></path></g></svg>
        </button>
      </div>

      <div className="calendar-footer">
        <div className="flex-pills">
          {pills.map(pill => (
            <button 
              key={pill} 
              className={`pill-btn ${flexibleDays === pill ? 'active' : ''}`}
              onClick={() => setFlexibleDays(pill)}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchCalendar;
