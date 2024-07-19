import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';

const Image = ({ src, alt, width, height, loading, style, onClick }) => {
  const [opacity, setOpacity] = useState(1);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      style={{ ...style, cursor: 'pointer', opacity, transition: 'opacity 0.3s ease-in-out' }}
      onMouseEnter={() => setOpacity(0.7)}
      onMouseLeave={() => setOpacity(1)}
      onClick={onClick}
    />
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.oneOf(['eager', 'lazy']),
  style: PropTypes.object,
  onClick: PropTypes.func,
};

Image.defaultProps = {
  width: 'auto',
  height: 'auto',
  loading: 'lazy',
  style: {},
  onClick: () => {},
};

export default memo(Image);