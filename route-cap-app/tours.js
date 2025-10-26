const createDriver = (steps) => {
  return driver({
    showProgress: true,
    steps: steps,
    popover: {
      className: 'driverjs-theme',
      showButtons: ['next', 'previous', 'close'],
      doneBtnText: 'Done',
      nextBtnText: 'Next',
      prevBtnText: 'Back',
    }
  });
};

export const tours = [
  {
    name: 'homePageTour',
    label: 'Home Page Tour',
    tour: [
      { xpath: '//*[@id="root"]/div/header/nav/div/div[1]/button', popover: { title: 'Welcome to E-Clone!', description: 'This is our logo. Click here to go to the home page at any time.' } },
      { xpath: '//*[@id="root"]/div/header/nav/div/div[2]/div/input', popover: { title: 'Search Products', description: 'Use this search bar to find any product you are looking for.' } },
      { xpath: '//*[@id="root"]/div/header/nav/div/div[3]/button[1]', popover: { title: 'Home Link', description: 'Navigate to the home page.' } },
      { xpath: '//*[@id="root"]/div/header/nav/div/div[3]/button[2]', popover: { title: 'My Orders', description: 'View your past orders here.' } },
      { xpath: '//*[@id="root"]/div/header/nav/div/div[3]/button[3]', popover: { title: 'Shopping Cart', description: 'Your shopping cart, showing the number of items.' } },
      { xpath: '//*[@id="root"]/div/header/nav/div/div[3]/div/button', popover: { title: 'Account Menu', description: 'Access your account details, wish list, and more.' } },
      { xpath: '//*[@id="root"]/div/main/div/div/div/aside', popover: { title: 'Product Filters', description: 'Filter products by category, brand, rating, and price range.' } },
      { xpath: '//*[@id="root"]/div/main/div/div/main/div/div[1]', popover: { title: 'Product Card', description: 'Each product is displayed in a card. Click on it to see details or add to cart.' } },
      { xpath: '//*[@id="root"]/div/main/div/div/main/div/div[1]/button', popover: { title: 'Wishlist Button', description: 'Add or remove products from your wishlist.' } },
      { xpath: '//*[@id="root"]/div/main/div/div/main/div/div[1]/div[2]/div[3]/button', popover: { title: 'Add to Cart Button', description: 'Add this product to your shopping cart.' } },
    ],
  },
  {
    name: 'productDetailTour',
    label: 'Product Detail Tour',
    tour: [

      {
        "xpath": "//*[@id=\"root\"]/div/header/nav/div/div[3]/button[1]",
        "popover": {
          "title": "Home",
          "description": "Return to the main homepage."
        },
        "nextActions": [
          { "action": "click", "xpath": '//*[@id=\"root\"]/div/header/nav/div/div[3]/button[1]' }
        ]

      },

      {
        "xpath": '//*[@id="root"]/div/main/div/div/main/div/div[1]/div[1]/img',
        "popover": {
          "title": "First Product",
          "description": "This is a product card. Click to view details"
        },
        "nextActions": [
          { "action": "click", "xpath": '//*[@id="root"]/div/main/div/div/main/div/div[1]/div[1]/img' }
        ]

      },
      {
        "xpath": '//*[@id="root"]/div/main/div/div[1]/div/div[1]/img',
        "popover": {
          "title": "Product Image",
          "description": "See a large image of the product."
        }
      },
      {
        "xpath": "//*[@id=\"root\"]/div/main/div/div[1]/div[1]/div[2]/div[1]/h1",
        "popover": {
          "title": "Product Title",
          "description": "This is the name of the product."
        }
      },
      {
        "xpath": "//*[@id=\"root\"]/div/main/div/div[1]/div[1]/div[2]/div[1]/p[3]",
        "popover": {
          "title": "Product Price",
          "description": "Here you can see the cost of the item."
        }
      },
      {
        "xpath": "//*[@id=\"root\"]/div/main/div/div[1]/div[1]/div[2]/div[2]/button[1]",
        "popover": {
          "title": "Add to Cart",
          "description": "Click this button to add the item to your shopping cart."
        }
      },
      {
        "xpath": "//*[@id=\"root\"]/div/main/div/div[1]/div[1]/div[2]/div[2]/button[2]",
        "popover": {
          "title": "Add to Wishlist",
          "description": "Save this item to your wishlist to buy later."
        }
      },
      {
        "xpath": "//*[@id=\"root\"]/div/main/div/div[2]/h2",
        "popover": {
          "title": "Customer Reviews",
          "description": "See what other customers think about this product."
        }
      }
    ],
  },
  {
    name: 'cartPageTour',
    label: 'Cart Page Tour',
    tour: [
      { element: 'h1.text-3xl.font-bold', popover: { title: 'Your Shopping Cart', description: 'This page displays all items currently in your cart.' } },
      { element: '.divide-y.divide-gray-200 > div:first-child', popover: { title: 'Cart Item', description: 'Each item in your cart is listed here with its details.' } },
      { element: '.divide-y.divide-gray-200 > div:first-child button:first-of-type', popover: { title: 'Decrease Quantity', description: 'Reduce the quantity of this item.' } },
      { element: '.divide-y.divide-gray-200 > div:first-child span.font-medium.text-lg', popover: { title: 'Item Quantity', description: 'Current quantity of the item in your cart.' } },
      { element: '.divide-y.divide-gray-200 > div:first-child button:last-of-type', popover: { title: 'Increase Quantity', description: 'Increase the quantity of this item.' } },
      { element: '.divide-y.divide-gray-200 > div:first-child button.ml-4', popover: { title: 'Remove Item', description: 'Remove this item from your cart.' } },
      { element: '.w-full.lg\\:w-1\\/3.h-fit.bg-white.p-6', popover: { title: 'Order Summary', description: 'A summary of your order, including subtotal, tax, and total.' } },
      { element: 'button.w-full.bg-blue-500', popover: { title: 'Proceed to Checkout', description: 'Click here to continue to the checkout process.' } },
    ],
  },
  {
    name: 'checkoutPageTour',
    label: 'Checkout Page Tour',
    tour: [
      { element: 'h1.text-3xl.font-bold', popover: { title: 'Checkout Process', description: 'This guides you through the steps to complete your purchase.' } },
      { element: '.flex.justify-between.items-center.bg-white.p-4', popover: { title: 'Checkout Steps', description: 'Track your progress through shipping, delivery, and payment.' } },
      { element: 'form.bg-white.p-6', popover: { title: 'Shipping Information', description: 'Enter your shipping address details here.' } },
      { element: 'button.w-full.bg-blue-500', popover: { title: 'Continue to Delivery', description: 'Proceed to select your delivery options.' } },
    ],
  },
  {
    name: 'ordersPageTour',
    label: 'Orders Page Tour',
    tour: [
      { element: 'h1.text-3xl.font-bold', popover: { title: 'Your Orders', description: 'View a list of all your past orders and their details.' } },
      { element: '.bg-white.rounded-lg.shadow-lg.overflow-hidden.mb-6:first-child', popover: { title: 'Order Details', description: 'Each card represents a past order with its status and items.' } },
      { element: '.bg-white.rounded-lg.shadow-lg.overflow-hidden.mb-6:first-child .bg-gray-100', popover: { title: 'Order Summary', description: 'Quick overview of order date, total, shipping address, and order number.' } },
      { element: '.bg-white.rounded-lg.shadow-lg.overflow-hidden.mb-6:first-child .p-4 > h3', popover: { title: 'Order Status', description: 'The current status of your order (e.g., Delivered, Shipped).' } },
      { element: '.bg-white.rounded-lg.shadow-lg.overflow-hidden.mb-6:first-child .flex.items-start.py-4:first-of-type', popover: { title: 'Ordered Item', description: 'Details of an item within this order.' } },
      { element: '.bg-white.rounded-lg.shadow-lg.overflow-hidden.mb-6:first-child .flex.items-start.py-4:first-of-type button.bg-gray-100', popover: { title: 'View Item', description: 'Click to view the product detail page for this item.' } },
      { element: '.bg-white.rounded-lg.shadow-lg.overflow-hidden.mb-6:first-child .flex.items-start.py-4:first-of-type button.bg-yellow-400', popover: { title: 'Write Review', description: 'Share your feedback on this product.' } },
    ],
  },
  {
    name: 'wishlistPageTour',
    label: 'Wishlist Page Tour',
    tour: [
      { element: 'h1.text-3xl.font-bold', popover: { title: 'Your Wish List', description: 'This is where you save products you are interested in.' } },
      { element: '.bg-white.p-6.rounded-lg.shadow-md > div > div:first-child', popover: { title: 'Wishlist Item', description: 'Each item you\'ve added to your wishlist is shown here.' } },
      { element: '.bg-white.p-6.rounded-lg.shadow-md > div > div:first-child button.bg-blue-500', popover: { title: 'Move to Cart', description: 'Move this item from your wishlist directly to your shopping cart.' } },
      { element: '.bg-white.p-6.rounded-lg.shadow-md > div > div:first-child button.bg-gray-100', popover: { title: 'Remove from Wishlist', description: 'Remove this item from your wishlist.' } },
    ],
  },
];
