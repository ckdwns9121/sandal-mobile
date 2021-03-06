import React from 'react';

const active_color = '#007246';
const normal_color = '#ccc';
const BottomNavCoupon = (props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24">
            <g transform="translate(13045 1935)">
                <g transform="translate(-22 -5)">
                    <g transform="translate(-13538 -157)" fill="none">
                        <path
                            d="M538-1753H516a1,1,0,0,1-1-1v-4a3,3,0,0,0,3-3,3,3,0,0,0-3-3v-4a1,1,0,0,1,1-1h22a1,1,0,0,1,1,1v14A1,1,0,0,1,538-1753Z"
                            stroke="none"
                        />
                        <path
                            d="M 537.5001220703125 -1754.500244140625 L 537.5001220703125 -1767.50048828125 L 516.4998168945313 -1767.50048828125 L 516.4998168945313 -1765.243041992188 C 518.2461547851563 -1764.6240234375 519.5004272460938 -1762.955810546875 519.5004272460938 -1761.000366210938 C 519.5004272460938 -1759.045288085938 518.2462158203125 -1757.376831054688 516.4998168945313 -1756.75732421875 L 516.4998168945313 -1754.500244140625 L 537.5001220703125 -1754.500244140625 M 538.0001831054688 -1753.000244140625 L 515.9996948242188 -1753.000244140625 C 515.4483642578125 -1753.000244140625 514.9998168945313 -1753.44873046875 514.9998168945313 -1754.000122070313 L 514.9998168945313 -1757.999755859375 C 516.6556396484375 -1758.000732421875 518.0004272460938 -1759.346435546875 518.0004272460938 -1761.000366210938 C 518.0004272460938 -1762.654296875 516.6543579101563 -1764 514.9998168945313 -1764 L 514.9998168945313 -1767.999633789063 C 514.9998168945313 -1768.551513671875 515.4483642578125 -1769.00048828125 515.9996948242188 -1769.00048828125 L 538.0001831054688 -1769.00048828125 C 538.5515747070313 -1769.00048828125 539.0001220703125 -1768.551513671875 539.0001220703125 -1767.999633789063 L 539.0001220703125 -1754.000122070313 C 539.0001220703125 -1753.44873046875 538.5515747070313 -1753.000244140625 538.0001831054688 -1753.000244140625 Z"
                            stroke="none"
                            fill={props.active ? active_color : normal_color}
                        />
                    </g>
                    <path
                        d="M-13016.407-1925.275v15.079"
                        transform="translate(0 -0.225)"
                        fill="none"
                        stroke={props.active ? active_color : normal_color}
                        strokeWidth="1.5"
                        strokeDasharray="1.5 1.8"
                    />
                    <g
                        transform="translate(-13012 -1922)"
                        fill="none"
                        stroke={props.active ? active_color : normal_color}
                        strokeWidth="1.5"
                    >
                        <rect width="8" height="5" rx="1" stroke="none" />
                        <rect
                            x="0.75"
                            y="0.75"
                            width="6.5"
                            height="3.5"
                            rx="0.25"
                            fill="none"
                        />
                    </g>
                    <path
                        d="M-13004.028-1914.621h-8"
                        fill="none"
                        stroke={props.active ? active_color : normal_color}
                        strokeWidth="1.5"
                    />
                </g>
                <rect
                    width="24"
                    height="24"
                    transform="translate(-13045 -1935)"
                    fill="none"
                />
            </g>
        </svg>
    );
};

BottomNavCoupon.defaultProps = {
    active: false,
};
export default BottomNavCoupon;
