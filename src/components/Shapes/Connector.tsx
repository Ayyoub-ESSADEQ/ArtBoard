interface ConnectorProps {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function Connector({ x1, y1, x2, y2, id }: Readonly<ConnectorProps>) {
  return (
    <>
      <defs>
        <marker
          id="head"
          orient="auto"
          markerWidth="3"
          markerHeight="4"
          refX="0.1"
          refY="2"
        >
          <path d="M0,0 V4 L2,2 Z" fill="black" />
        </marker>
      </defs>
      <line
        data-type="connector"
        id={id}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        markerEnd="url(#head)"
        fill="none"
        stroke="black"
        strokeWidth={3}
      />
    </>
  );
}
