/** 'en-CA' locale formats as YYYY-MM-DD
 * using NZ time regardless of device timezone. 
 */
const formatLocalDate = (d: Date): string => {
  return d.toLocaleDateString('en-CA', { timeZone: 'Pacific/Auckland' }); 
};

export const getTodayDate = (): string => {
  return formatLocalDate(new Date());
};

export const getLast7Days = (): string[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return formatLocalDate(d);
  });
};