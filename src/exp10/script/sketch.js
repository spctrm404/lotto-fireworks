let timeInFrame = 0;
const eachDayInTime = 60;
let todayNth = 0;
let lastDayNth = 0;
let weekNth = 0;

function setup() {
  setSketchContainer(3 / 2, 'canvas');
  background(255);
}

const timer = (adder) => {
  timeInFrame += adder;
  const calcedTodayNth = parseInt(timeInFrame / eachDayInTime);
  if (calcedTodayNth !== lastDayNth) {
    const howManyDayPassed = calcedTodayNth - lastDayNth;
    for (
      let eachDayPassed = 0;
      eachDayPassed < howManyDayPassed;
      eachDayPassed++
    ) {
      todayNth = lastDayNth + eachDayPassed + 1;
      weekNth = parseInt((todayNth - 1) / 6) + 1;

      console.log(`오늘은 ${todayNth}번째 날입니다.`);
      console.log(`오늘은 ${weekNth}번째 주입니다.`);
      const idxForLottoNums = todayNth - 1;
      const idxForWinningNums = weekNth - 1;
      console.log(lottoNums[idxForLottoNums]);
      console.log(winningNums[idxForWinningNums]);
    }
  }
  lastDayNth = calcedTodayNth;
};

function draw() {
  timer(120);
}
