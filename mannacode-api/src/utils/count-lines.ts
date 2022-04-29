export const getLines = (text)=>{
  // eslint-disable-next-line no-control-regex
  return (text.match(new RegExp('\n', 'g')) || []).length + 1;
};