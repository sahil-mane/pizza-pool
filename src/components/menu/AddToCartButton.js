import FlyingButton from "react-flying-item";

export default function AddToCartButton({
  hasSizesOrExtras,
  onClick,
  basePrice,
  image,
}) {
  if (!hasSizesOrExtras) {
    return (
      <div className="flying-button-parent mt-4">
        <FlyingButton targetTop={"5%"} targetLeft={"95%"} src={image}>
          <div className="w-full" onClick={onClick}>Add to cart ₹{basePrice}</div>
        </FlyingButton>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={onClick}
        className="mt-4 bg-primary text-white px-8 py-2 font-semibold rounded-full"
      >
        {hasSizesOrExtras && <span>Add to cart (from ₹{basePrice})</span>}
      </button>
    </>
  );
}
