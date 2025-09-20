import React from 'react';
import { Handle, Position } from 'reactflow';

const CheckboxNode = ({ data }) => {
  const { label, checked, onCheck } = data;

  const handleCheckboxChange = () => {
    if (onCheck) {
      onCheck();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: 'white' }}>
      <Handle type="target" position={Position.Top} />
      <input type="checkbox" checked={checked} onChange={handleCheckboxChange} style={{ marginRight: '10px' }} />
      <div>{label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CheckboxNode;