import imgDepth4Frame0 from "figma:asset/48af025faa06451c3bf16671e456586d6711d5d7.png";

function Depth4Frame() {
  return (
    <div className="basis-0 grow min-h-[320px] min-w-px relative shrink-0 w-full" data-name="Depth 4, Frame 0">
      <div aria-hidden="true" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 pointer-events-none">
        <div className="absolute bg-[#12211c] bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0" />
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border max-w-none object-50%-50% object-cover size-full" src={imgDepth4Frame0} />
      </div>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-full" />
    </div>
  );
}

function Depth3Frame() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Depth 3, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative size-full">
        <Depth4Frame />
      </div>
    </div>
  );
}

function Depth2Frame() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <Depth3Frame />
      </div>
    </div>
  );
}

function Depth2Frame1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 1">
      <div className="flex flex-col items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center pb-[12px] pt-[20px] px-[16px] relative w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[35px] not-italic relative shrink-0 text-[28px] text-center text-nowrap text-white w-full whitespace-pre">Welcome to MindBloom</p>
        </div>
      </div>
    </div>
  );
}

function Depth2Frame2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 2">
      <div className="flex flex-col items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center pb-[12px] pt-[4px] px-[16px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white w-full whitespace-pre">Your personal emotional companion, here to support you through every moment.</p>
        </div>
      </div>
    </div>
  );
}

function Depth5Frame() {
  return (
    <div className="relative shrink-0" data-name="Depth 5, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit]">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[24px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#12211c] text-[16px] text-center text-nowrap w-full whitespace-pre">Get Started</p>
      </div>
    </div>
  );
}

function Depth4Frame2() {
  return (
    <div className="bg-[#12eda3] h-[48px] max-w-[480px] min-w-[84px] relative rounded-[12px] shrink-0 w-full" data-name="Depth 4, Frame 0">
      <div className="flex flex-row items-center justify-center max-w-inherit min-w-inherit overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[48px] items-center justify-center max-w-inherit min-w-inherit px-[20px] py-0 relative w-full">
          <Depth5Frame />
        </div>
      </div>
    </div>
  );
}

function Depth5Frame1() {
  return (
    <div className="relative shrink-0" data-name="Depth 5, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit]">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[24px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-center text-nowrap text-white w-full whitespace-pre">Learn More</p>
      </div>
    </div>
  );
}

function Depth4Frame1() {
  return (
    <div className="bg-[#24473d] h-[48px] max-w-[480px] min-w-[84px] relative rounded-[12px] shrink-0 w-full" data-name="Depth 4, Frame 1">
      <div className="flex flex-row items-center justify-center max-w-inherit min-w-inherit overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[48px] items-center justify-center max-w-inherit min-w-inherit px-[20px] py-0 relative w-full">
          <Depth5Frame1 />
        </div>
      </div>
    </div>
  );
}

function Depth3Frame1() {
  return (
    <div className="basis-0 grow max-w-[480px] min-h-px min-w-px relative shrink-0" data-name="Depth 3, Frame 0">
      <div className="max-w-inherit size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] items-start max-w-inherit px-[16px] py-[12px] relative w-full">
          <Depth4Frame2 />
          <Depth4Frame1 />
        </div>
      </div>
    </div>
  );
}

function Depth2Frame3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start justify-center relative w-full">
        <Depth3Frame1 />
      </div>
    </div>
  );
}

function Depth1Frame() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 1, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <Depth2Frame />
        <Depth2Frame1 />
        <Depth2Frame2 />
        <Depth2Frame3 />
      </div>
    </div>
  );
}

function Depth2Frame4() {
  return (
    <div className="bg-[#12211c] h-[20px] relative shrink-0 w-full" data-name="Depth 2, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] w-full" />
    </div>
  );
}

function Depth1Frame1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 1, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <Depth2Frame4 />
      </div>
    </div>
  );
}

function Depth0Frame() {
  return (
    <div className="bg-[#12211c] min-h-[844px] relative shrink-0 w-full" data-name="Depth 0, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-between min-h-inherit overflow-clip relative rounded-[inherit] w-full">
        <Depth1Frame />
        <Depth1Frame1 />
      </div>
    </div>
  );
}

export default function StitchDesign() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Stitch Design">
      <Depth0Frame />
    </div>
  );
}