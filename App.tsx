import React, {useState, useRef, Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const TimerApp = () => {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [lapTimes, setLapTimes] = useState([]);
  const timerRef = useRef(null);
  const lapTimersRef = useRef([]); // Mảng chứa các bộ đếm thời gian của các dòng lap
  const minTime = Math.min(...lapTimes);
  const maxTime = Math.max(...lapTimes);
  const formatTime = time => {
    const pad = n => (n < 10 ? '0' + n : n);
    const minutes = Math.floor(time / (60 * 100)); // tính phút
    const seconds = Math.floor((time % (60 * 100)) / 100); // tính giây
    const milliseconds = Math.floor(time % 100); // tính mili giây
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
  };

  const handleLapOrResetPress = () => {
    if (running) {
      // Dừng bộ đếm thời gian của dòng lap trước đó nếu có
      if (lapTimersRef.current.length > 0) {
        clearInterval(lapTimersRef.current[lapTimersRef.current.length - 1]);
      }

      // Thêm thời gian của lap hiện tại vào lapTimes
      setLapTimes(prevLapTimes => [...prevLapTimes, 0]);

      // Bắt đầu bộ đếm thời gian mới cho dòng lap mới từ 0
      const lapTimer = setInterval(() => {
        setLapTimes(prevLapTimes => {
          const updatedLapTimes = [...prevLapTimes];
          updatedLapTimes[updatedLapTimes.length - 1] += 1;
          return updatedLapTimes;
        });
      }, 10); // interval 10ms

      lapTimersRef.current.push(lapTimer);
    } else {
      // Nếu đã dừng, dừng bộ đếm thời gian chính, đặt thời gian về 0, và làm mới lapTimes
      clearInterval(timerRef.current);
      setTime(0);
      setLapTimes([]);
    }
  };

  const handleStartOrStopPress = () => {
    setRunning(prevRunning => {
      const newRunning = !prevRunning;
      if (newRunning) {
        if (!timerRef.current) {
          timerRef.current = setInterval(() => {
            setTime(prevTime => prevTime + 1);
          }, 10); // interval 10ms
        }
      } else {
        clearInterval(timerRef.current);
        timerRef.current = null;
        if (lapTimersRef.current.length > 0) {
          clearInterval(lapTimersRef.current[lapTimersRef.current.length - 1]);
        }
      }
      return newRunning;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timeWrapper}>
          <Text style={styles.timer}>{formatTime(time)}</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLapOrResetPress}>
            <Text style = {{fontSize: 20, fontWeight: '400', color: 'white'}}>{running ? 'Lap' : 'Reset'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              running ? styles.stopButton : styles.startButton,
            ]}
            onPress={handleStartOrStopPress}>
            <Text style={{fontSize: 20, fontWeight: '400', color: running ? 'red' : 'lightgreen'}}>
              {running ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        {lapTimes.map((lapTime, index) => (
          <View style={styles.lap} key={index}>
            <Text
              style={[
                styles.lapText,
                lapTime === minTime && {color: 'green'},
                lapTime === maxTime && {color: 'red'},
              ]}>
              Lap #{index + 1}
            </Text>
            <Text
              style={[
                styles.lapText,
                lapTime === minTime && {color: 'green'},
                lapTime === maxTime && {color: 'red'},
              ]}>
              {formatTime(lapTime)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Thiết lập màu nền là đen
  },
  header: {
    flex: 1,
    marginTop: 80,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  timeWrapper: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  lap: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
  },
  button: {
    borderWidth: 2,
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray', // Thiết lập màu nền của nút là trắng
  },
  startButton: {
    borderColor: 'green',
  },
  stopButton: {
    borderColor: 'red',
  },
  resetButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  timer: {
    fontSize: 90,
    marginHorizontal: 20,
    fontWeight: '200',
    color: 'white', // Thiết lập màu chữ là trắng
  },
  lapText: {
    fontSize: 20,
    fontWeight: '400',
    color: 'white', // Thiết lập màu chữ là trắng
  },
});

export default TimerApp;
