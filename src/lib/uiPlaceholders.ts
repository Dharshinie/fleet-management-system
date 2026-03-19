const DRIVER_IMAGE_URL =
  'https://img.freepik.com/premium-vector/people-avatar-icons-driver_755164-20757.jpg?semt=ais_rp_progressive&w=740&q=80';

const VEHICLE_IMAGE_URL =
  'https://imgd.aeplcdn.com/370x208/cw/ec/38219/Mahindra-XUV300-Exterior-147500.jpg?wm=0&q=80';

export const getDriverPlaceholderImage = (_seed: string) => DRIVER_IMAGE_URL;

export const getVehiclePlaceholderImage = (_seed: string) => VEHICLE_IMAGE_URL;

export const statusAnimationUrls = {
  maintenance:
    import.meta.env.VITE_LOTTIE_MAINTENANCE_URL ??
    'https://assets2.lottiefiles.com/packages/lf20_6wutsrox.json',
  active:
    import.meta.env.VITE_LOTTIE_ACTIVE_URL ??
    'https://assets9.lottiefiles.com/packages/lf20_j1adxtyb.json',
};
