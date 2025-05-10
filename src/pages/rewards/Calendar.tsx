import React, { useState, useEffect } from 'react';
import { Calendar } from 'antd';
import dayjs from 'dayjs';

interface CheckInRecord {
  [date: string]: boolean;
}

const DailyCalendar: React.FC = () => {
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord>({});

  // 模拟从本地存储获取签到记录
  useEffect(() => {
    const storedRecords = localStorage.getItem('checkInRecords');
    if (storedRecords) {
      setCheckInRecords(JSON.parse(storedRecords));
    }
  }, []);

  // 保存签到记录到本地存储
  const saveCheckInRecords = (records: CheckInRecord) => {
    localStorage.setItem('checkInRecords', JSON.stringify(records));
  };

  // 处理签到操作
  const handleCheckIn = (date: dayjs.Dayjs) => {
    const dateString = date.format('YYYY-MM-DD');
    const newRecords = { ...checkInRecords, [dateString]: true };
    setCheckInRecords(newRecords);
    saveCheckInRecords(newRecords);
  };

  // 渲染日历日期单元格
  const dateCellRender = (date: dayjs.Dayjs) => {
    const dateString = date.format('YYYY-MM-DD');
    const isCheckedIn = checkInRecords[dateString];
    return (
      <div>
        {isCheckedIn ? (
          <span style={{ color: 'green' }}>✔</span>
        ) : (
          <button onClick={() => handleCheckIn(date)}>签到</button>
        )}
      </div>
    );
  };

  return (
    <div>
      <Calendar cellRender={dateCellRender} />
    </div>
  );
};

export default DailyCalendar;
