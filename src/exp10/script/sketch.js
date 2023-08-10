const fireworks = [];

let timeSpeed = 1;
let timeInFrame = 0;
const eachDayInTime = 120;
let todayNth = 0;
let lastDayNth = 0;
let weekNth = 0;

// 좌우 마진
const mx = [200, 200];
// 각 요일별 폭죽 x좌표
const eachDayX = [0, 0, 0, 0, 0, 0];
// 상하 마진
const my = [200, 200];
// 폭죽 솟는 최대 높이
const fireworksHMax = 500;
// 폭죽의 최소 속도
const fireworksVelMin = 50;
// 폭죽의 최대 속도
const fireworksVelMax = 300;
let gravity;
const windMag = 0.1;
const frictionC = 0.5;

let pg;

function setup() {
  setSketchContainer(2 / 1, 'canvas');

  const timeSlider = document.getElementById('timeSpeed');
  timeSlider.addEventListener('input', (evt) => {
    // console.log(evt.target.value);
    timeSpeed = Number(evt.target.value);
  });

  // 좌우 마진 반영해 각 요일별 폭죽 x좌표 등분
  for (let idx = 0; idx < 6; idx++) {
    eachDayX[idx] = ((width - mx[0] - mx[1]) / 7) * (idx + 1) + mx[0];
  }
  gravity = createVector(0, 0.5);
  console.log(eachDayX);

  background(255);

  pg = createGraphics(width, height);
}

const timer = (adder) => {
  // 타이머 오름
  timeInFrame += adder;
  // 시간을 기준으로 몇번째 날인지 계산
  const calcedTodayNth = parseInt(timeInFrame / eachDayInTime);
  // 이전 날짜랑 비교해서 날짜 달라졌다면
  if (calcedTodayNth !== lastDayNth) {
    // 몇 일이 지나버렸는지 계산
    const howManyDayPassed = calcedTodayNth - lastDayNth;
    // 지나버린 날짜만큼 반복
    for (
      let eachDayPassed = 0;
      eachDayPassed < howManyDayPassed;
      eachDayPassed++
    ) {
      // 몇 번째 날짜인지 변수 업데이트
      todayNth = lastDayNth + eachDayPassed + 1;
      // 해당 날짜가 몇번째 주인지 변수 업데이트
      weekNth = parseInt((todayNth - 1) / 6) + 1;
      // 인덱스로 환산
      const idxForEachDayData = todayNth - 1;
      const idxForWinningNums = weekNth - 1;
      // 오늘자 데이터와 해당하는 주차 당첨정보 가져오기
      const todaysData = eachDayData[idxForEachDayData];
      const thisWeekWinningNum = winningNums[idxForWinningNums];
      // 위 둘 중 하나라도 정보가 없으면 그만함 안그러면 터짐
      if (todaysData === undefined || thisWeekWinningNum === undefined) break;
      // 데이터베이스에 계산된 날짜, 주차 정보 추가
      todaysData.dayNth = todayNth;
      todaysData.weekNth = weekNth;
      thisWeekWinningNum.weekNth = weekNth;
      // 하루에 몇개나 맞췄는지 담을 변수
      let sumHowManyMached = 0;
      // 각 조별 몇개나 맞췄는지 담을 변수
      todaysData.howManyMached = [];
      // 각 조별로 함수 실행
      todaysData.lottoSequences.forEach((eachLottoSequence, idx) => {
        // 이번 조에서 몇개나 맞췄는지 담을 변수에 만든 함수를 통한 결과 담기
        const howManyMached = comparingWinningNum(
          eachLottoSequence,
          thisWeekWinningNum.winningSequence
        );
        // 이번 조의 당첨 결과를 어레이에 푸쉬
        todaysData.howManyMached.push(howManyMached);
        // 이번 조의 당첨 결과를 변수에 누적 (하루 집계용)
        sumHowManyMached += howManyMached;
      });
      // 각 조별로 계산이 끝난 결과를 데이터베이스에 추가
      todaysData.sumHowManyMached = sumHowManyMached;
      // console.log(todaysData, thisWeekWinningNum);
      fireworks.push(new Fireworks(todaysData, thisWeekWinningNum));
    }
  }
  lastDayNth = calcedTodayNth;
};

const comparingWinningNum = (aSequence, winningSequence) => {
  let cnt = 0;
  for (let idx = 5; idx >= 0; idx--) {
    if (aSequence[idx] !== winningSequence[idx]) break;
    cnt++;
  }
  return cnt;
};

function draw() {
  for (let idx = fireworks.length - 1; idx >= 0; idx--) {
    fireworks[idx].update(gravity, windMag, frictionC);
    if (fireworks[idx].isDead) {
      fireworks.splice(idx, 1);
      console.log(fireworks.length);
    }
  }
  background(0, 16);
  timer(timeSpeed);
  for (let idx = fireworks.length - 1; idx >= 0; idx--) {
    fireworks[idx].display();
  }

  pg.clear();
  pg.fill(255);
  pg.text('금', eachDayX[0], height - my[1]);
  pg.text('토', eachDayX[1], height - my[1]);
  pg.text('일', eachDayX[2], height - my[1]);
  pg.text('월', eachDayX[3], height - my[1]);
  pg.text('화', eachDayX[4], height - my[1]);
  pg.text('수', eachDayX[5], height - my[1]);
  pg.text(`${todayNth}일`, 10, 10);
  pg.text(`${weekNth}주`, 10, 20);

  image(pg, 0, 0);
}
