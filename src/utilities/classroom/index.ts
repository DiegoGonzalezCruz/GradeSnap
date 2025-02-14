export const getSummary = async () => {
  const response = await fetch('/api/classroom/summary')
  console.log(response, 'RESPONSE suMMARy')
}
