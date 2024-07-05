export default (len, type = 'number') => {
  let chs = '';
  let res = '';
  if (type === 'mix') {
    chs = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLOMNOPQRSTUVWXYZ';
  } else if (type === 'imix') {
    chs = '1234567890ABCDEFGHIJKLOMNOPQRSTUVWXYZ';
  } else if (type === 'char') {
    chs = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLOMNOPQRSTUVWXYZ';
  } else if (type === 'ichar') {
    chs = 'ABCDEFGHIJKLOMNOPQRSTUVWXYZ';
  } else {
    chs = '1234567890';
  }
  if (len < 1) {
    len = 0;
  }
  for (let i = 0, l = chs.length - 1; i < len; i++) {
    let ran = Math.round(Math.random() * l);
    res += chs[ran];
  }
  return res;
}