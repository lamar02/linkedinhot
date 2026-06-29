const POST_DAYS_3 = [1, 3, 5]; // Mon, Wed, Fri
const POST_DAYS_4 = [1, 3, 5, 6]; // Mon, Wed, Fri, Sat
const DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

export function isTodayPostDay() {
  const now = new Date();
  const day = now.getDay();
  const week = getISOWeek(now);
  const postDays = week % 2 === 0 ? POST_DAYS_4 : POST_DAYS_3;
  return postDays.includes(day);
}

export function alreadyPostedToday(lastPostDate) {
  if (!lastPostDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return lastPostDate.startsWith(today);
}

export function getNextSchedule(current) {
  return {
    themeIndex: (current.themeIndex + 1) % 7,
    lastPostDate: new Date().toISOString(),
    postCount: current.postCount + 1,
  };
}

export function getPostDaysLabel() {
  const week = getISOWeek(new Date());
  const postDays = week % 2 === 0 ? POST_DAYS_4 : POST_DAYS_3;
  return postDays.map(d => DAY_NAMES[d]).join(', ');
}
