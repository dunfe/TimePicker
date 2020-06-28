import React, { useState, useEffect } from "react";
import "./styles.css";
import { TimePicker } from "antd";
import "antd/dist/antd.css";
import moment from "moment";

const HHmm = "HH:mm";

export default function App() {
  const [time, setTime] = useState({
    start: moment("8:30", HHmm),
    end: moment("9:30", HHmm),
    duration: moment("1:00", HHmm)
  });
  const [update, setUpdate] = useState({
    start: false,
    duration: false,
    end: false
  });

  const onStartChange = value => {
    setTime(time => ({ ...time, start: value }));
    setUpdate({ ...update, start: true });
  };

  const onDurationChange = value => {
    setTime(time => ({ ...time, duration: value }));
    setUpdate({ ...update, duration: true });
  };

  const onEndChange = value => {
    setTime(time => ({ ...time, end: value }));
    setUpdate({ ...update, end: true });
  };

  useEffect(() => {
    if (update.start || update.duration || update.end) {
      const timeChange = () => {
        // thời gian chêch lệch giữa end time và start time
        const diffHours = time.end.diff(time.start, "hours");
        const diffMinutes = moment
          .utc(moment(time.end, HHmm).diff(moment(time.start, HHmm)))
          .format("mm");

        const startToEndTime = moment(time.start)
          .add(time.duration.hours(), "h")
          .add(time.duration.minutes(), "m");

        // kiểm tra nếu là update end time
        if (update.end) {
          // set duration mới
          setTime(time => ({
            ...time,
            duration: moment(`${diffHours} : ${diffMinutes}`, HHmm)
          }));
        }
        // kiểm tra nếu update start time hoặc duration
        else if (update.duration || update.start) {
          // set end time mới
          setTime(time => ({ ...time, end: startToEndTime }));
        }
      };
      timeChange();
      setUpdate({ ...update, start: false, duration: false, end: false });
    }
  }, [update, time]);

  return (
    <div className="App">
      <span>Start: </span>
      <TimePicker value={time.start} onChange={onStartChange} format={HHmm} />
      <span>Duration: </span>
      <TimePicker
        value={time.duration}
        onChange={onDurationChange}
        format={HHmm}
      />
      <span>End: </span>
      <TimePicker value={time.end} onChange={onEndChange} format={HHmm} />
    </div>
  );
}
