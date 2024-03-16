import { Folder, RightPanelCollapse, Star } from "./icons/Icons";

const Title = ({ title, icon }: { title: string; icon: React.ReactNode }) => {
  return (
    <div className="w-full text-[12px] flex flex-row items-center gap-2 inter-regular h-fit py-2 px-2">
      {icon}
      <div>{title}</div>
    </div>
  );
};

const Separator = ({ name }: { name: string }) => {
  return (
    <div className="w-full text-[12px] inter-light  h-fit  py-2 px-2 text-[#747c89]">
      {name}
    </div>
  );
};

interface SectionProps {
  children: React.ReactComponentElement<"div">[];
}
const Section = (props: SectionProps) => {
  return (
    <div className="w-full text-[#7c7c7c] h-fiit pl-4">{props.children}</div>
  );
};

export function NavBar() {
  return (
    <div className="h-full min-w-[250px] w-[250px] border-r-2 bg-[#F9F9F9] ">
      <div className="w-full h-32">
        <div className="w-full px-3 h-12 flex flex-row items-center justify-between">
          <div>Whithy</div>
          <RightPanelCollapse />
        </div>
      </div>
      <Separator name="FAVORITES" />
      <Section>
        <Title title="Personal" icon={<Star />} />
        <Title title="Work" icon={<Star />} />
        <Title title="Whiteboard" icon={<Star />} />
        <Title title="Something" icon={<Star />} />
      </Section>
      <Separator name="SPACES" />
      <Section>
        <Title title="Personal" icon={<Folder />} />
        <Title title="Work" icon={<Folder />} />
        <Title title="Whiteboard" icon={<Folder />} />
        <Title title="Something" icon={<Folder />} />
      </Section>
    </div>
  );
}
