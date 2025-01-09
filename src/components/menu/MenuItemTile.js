import Image from "next/image";
import AddToCartButton from './AddToCartButton'

export default function MenuItemTile({onAddToCart,...item}) {
    const {name,image,description,basePrice,sizes,extraIngredientPrices} = item;
    const hasSizesOrExtras = sizes?.length > 0 || extraIngredientPrices?.length > 0;
    return(
        <>
        <div className="bg-gray-200 hover:bg-white p-4 rounded-lg text-center transition-all hover:shadow-md hover:shadow-black/25">
        <div className="text-center">
        <Image src={image} alt="pizza" height={144} width={144} className="max-h-auto max-h-36 max-w-36 block mx-auto" />
        </div>
        <h4 className="font-semibold text-xl my-3">{name}</h4>
        <p className="text-gray-500 text-sm line-clamp-3">
            {description}         
        </p>
        <AddToCartButton image={image} hasSizesOrExtras={hasSizesOrExtras} onClick={onAddToCart} basePrice={basePrice} />
    </div>
        </>
    )
}