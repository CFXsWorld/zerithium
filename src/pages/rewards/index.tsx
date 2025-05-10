import Calendar from './Calendar';
function Rewards() {
  return (
    <div className="max-md:mt-0px mt-[30px]  flex flex-col items-center p-[20px] max-md:px-[16px] max-md:pb-[80px]">
      <div className="w-full max-w-[1200px]  overflow-hidden max-md:mx-0">
        <div className="flex-center-between pb-[20px] max-md:pb-[5px]"></div>
        <div className="flex-center-between pb-[20px] max-md:flex-col max-md:justify-start">
          <Calendar />
        </div>
        <div className="flex justify-between gap-[24px] max-md:flex-col">
          <div className="flex w-[600px] flex-shrink-0 flex-col gap-[24px] overflow-hidden max-md:w-full "></div>
        </div>
      </div>
    </div>
  );
}

export default Rewards;
