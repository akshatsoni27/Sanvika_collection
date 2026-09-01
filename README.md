# Sanvika Collection Catalog

Build a Complete Clothing Catalog Website — Sanvika Collection

Build a modern, elegant, responsive clothing business website called “Sanvika Collection”.

Sanvika Collection is a small Indian clothing business selling Sarees, Suits, Kurtas and other ethnic/fashion wear.

The website should work primarily as a beautiful online product catalog. Customers should be able to browse products, view prices/details, and contact the business through WhatsApp or Instagram DM to place an order.

There should be NO online payment system initially. Orders are placed manually through WhatsApp or Instagram.

1. Overall Design

Create a premium Indian fashion/boutique aesthetic.

Design direction:

Elegant

Modern

Minimal

Feminine but not overly decorative

Premium/luxury clothing-store feel

Indian ethnic fashion influence

Lots of whitespace

High-quality product photography should be the visual focus

Smooth subtle animations

Fully responsive

Mobile-first

Suggested visual style:

Cream / ivory background

Burgundy / maroon accents

Muted gold accents

Dark charcoal text

Elegant serif font for headings

Clean sans-serif font for body text

Do NOT make the website look like a generic template.

It should feel like a real premium Indian boutique brand.

2. Website Pages

Create the following pages:

Home

Navbar

Brand logo/name: SANVIKA COLLECTION

Hero section

New Arrivals

Featured Categories

Featured Products

About Sanvika Collection

Instagram section

WhatsApp CTA

Footer

Shop / All Products

Display all products in a responsive grid.

Include:

Search

Category filter

Price filter

Sorting

Product cards

Pagination or infinite scrolling if needed

Categories:

Sarees

Suits

Kurtas

Lehengas

Dupattas

Other

The admin should be able to add/edit categories later.

Product Details

Each product should have:

Large product image

Image gallery

Product name

Price

Category

Description

Fabric

Color

Size/variant information where applicable

Availability status

Product ID/SKU

“Order on WhatsApp” button

“DM on Instagram” button

Related products

If the product is sold out, replace the order button with:

SOLD OUT

but allow the admin to make it available again.

About

Create a clean brand story section for Sanvika Collection.

Use placeholder content that can easily be edited later.

Contact

Include:

WhatsApp

Instagram

Phone number

Business location

Business hours

Use placeholders for these details initially.

3. Floating Contact Buttons

This is important.

Create fixed floating buttons visible while scrolling.

Bottom-right:

🟢 WhatsApp
📷 Instagram

They should remain fixed on desktop and mobile.

WhatsApp button should open the business WhatsApp chat.

Instagram button should open the business Instagram profile.

Make the buttons elegant and unobtrusive rather than huge.

4. WhatsApp Ordering

Every product must have an Order on WhatsApp button.

When clicked, automatically generate a WhatsApp message containing the product information.

Example:

“Hi Sanvika Collection, I’m interested in this product:

Product: Banarasi Silk Saree
Product ID: SC-102
Price: ₹2,499

Is this product available?”

The WhatsApp number should be stored in one configurable location so the owner can change it without modifying multiple files.

5. Instagram Ordering

Add a DM on Instagram button.

It should open the Sanvika Collection Instagram profile.

Where possible, prefill or display a suggested message such as:

“Hi, I’m interested in [Product Name], Product ID [ID].”

Store the Instagram username in one configurable location.

6. ADMIN DASHBOARD

This is one of the most important parts of the project.

Create a secure admin dashboard at:

/admin

The owner should be able to manage the entire catalog without touching code.

Admin features:

Dashboard

Show:

Total products

Available products

Sold-out products

Categories

Recently added products

Add Product

Fields:

Product name

Product ID / SKU

Category

Price

Discount price (optional)

Description

Fabric

Color

Sizes

Availability

Featured product toggle

New arrival toggle

Multiple product images

Allow image upload with preview.

Edit Product

Admin can:

Change product name

Change price

Change description

Replace/add/remove images

Change category

Change availability

Change featured status

Change new-arrival status

Delete Product

Allow deletion with a confirmation dialog.

Mark as Sold Out

Provide a simple toggle:

AVAILABLE / SOLD OUT

Manage Categories

Admin should be able to:

Add category

Rename category

Delete category

7. Image Management

Product photography is extremely important.

Allow multiple images per product.

Example:

Product:
Banarasi Silk Saree

Images:

Front

Back

Close-up

Detail

Model wearing it

Product cards should use optimized images.

Implement:

Image compression/optimization

Lazy loading

Responsive images

Proper aspect ratios

Image preview before upload

Do not stretch or distort product images.

8. New Arrivals

Products marked:

NEW ARRIVAL = true

should automatically appear in the New Arrivals section.

Display a small elegant:

NEW ✨

badge on the product card.

Sort new arrivals by newest upload date.

The homepage should automatically update when the admin uploads a new product.

9. Product Cards

Create beautiful product cards.

Each card should contain:

Product image

New badge if applicable

Product name

Category

Price

Discounted price if available

Sold Out badge if unavailable

View Product button

Quick WhatsApp button

Hover effects should be subtle.

On mobile, cards should remain easy to browse.

10. Search

Implement product search.

Users should be able to search:

Product name

Category

Product ID

Fabric

Color

Example:

Searching:

“silk”

should show all silk products.

11. Filters

Add filters for:

Category

Sarees

Suits

Kurtas

etc.

Price

Example:

Under ₹1,000

₹1,000–₹2,000

₹2,000–₹5,000

₹5,000+

Also provide a custom price range if practical.

Availability

Available

Sold Out

Sort

Newest

Price: Low to High

Price: High to Low

Popular / Featured

12. Database

Use a proper database rather than hardcoded products.

Recommended:

Supabase + PostgreSQL

Create tables for:

products

id

product_name

sku

category_id

price

discount_price

description

fabric

color

sizes

available

featured

new_arrival

created_at

updated_at

categories

id

name

slug

created_at

product_images

id

product_id

image_url

display_order

created_at

Use Supabase Storage for product images.

13. Authentication

Admin dashboard must NOT be publicly accessible.

Implement secure admin authentication.

Only authorized admin users should be able to:

Add products

Edit products

Delete products

Upload images

Change prices

Manage categories

Normal visitors should only be able to view products.

Never expose admin credentials in frontend code.

14. Tech Stack

Use a modern production-ready stack.

Preferred:

Frontend:

Next.js

React

TypeScript

Tailwind CSS

Backend/database:

Supabase

PostgreSQL

Supabase Storage

Supabase Auth

Icons:

Lucide React

Use reusable components and clean architecture.

Do not put everything in one huge component/file.

15. Responsive Design

The website MUST work perfectly on:

Mobile phones

Tablets

Laptops

Desktop monitors

Pay special attention to mobile because many customers will arrive from Instagram/WhatsApp.

Mobile navigation should use a clean hamburger menu.

Product grids:

Mobile:
2 columns

Tablet:
2–3 columns

Desktop:
3–4 columns

16. SEO

Implement basic SEO.

Include:

Proper page titles

Meta descriptions

Open Graph metadata

Product metadata

Semantic HTML

Sitemap

Robots.txt

Clean URLs

Example product URL:

/product/banarasi-silk-saree-sc-102

Category URLs:

/sarees
/suits
/kurtas

17. Performance

The website should be fast.

Implement:

Image optimization

Lazy loading

Code splitting where appropriate

Server-side rendering/static generation where appropriate

Avoid unnecessary API requests

Proper caching

Loading skeletons

Do not sacrifice performance for animations.

18. Homepage Structure

Create the homepage in approximately this order:

Announcement bar

Example:

“✨ New Collection Now Available”

Navbar

SANVIKA COLLECTION

Home | Shop | Sarees | Suits | Kurtas | About | Contact

Hero

Large beautiful fashion image.

Headline:

“Elegance in Every Thread”

Subheading:

“Discover timeless Indian fashion, thoughtfully curated for every occasion.”

Buttons:

SHOP COLLECTION
NEW ARRIVALS

Categories

Sarees
Suits
Kurtas
Lehengas

New Arrivals

Show latest products.

Featured Collection

Show products marked as Featured by admin.

Brand story

Short introduction to Sanvika Collection.

Instagram section

“Follow Sanvika Collection”

WhatsApp CTA

“Looking for something special?”

“Chat with us on WhatsApp”

Footer

19. Admin UX

The admin dashboard should be extremely simple because the clothing-business owner may not be technical.

Prefer:

Large buttons
Clear labels
Simple forms
Drag-and-drop image upload
Image previews
Easy price editing
Clear AVAILABLE / SOLD OUT toggle

The owner should be able to add a product in less than 2 minutes.

20. Important Business Requirement

Do NOT build a complicated checkout/cart/payment system.

The initial business flow is:

Customer visits website
↓
Browses products
↓
Opens product
↓
Clicks WhatsApp / Instagram
↓
Contacts Sanvika Collection
↓
Owner confirms order manually

Design the entire website around making this process extremely easy.

21. Future Scalability

Structure the code so that these features can be added later without rebuilding the entire application:

Shopping cart

Online payments

Customer accounts

Order management

Coupons

Inventory management

Reviews

Wishlist

Product variants

Size charts

Delivery tracking

Push notifications

WhatsApp API integration

Do not implement these now unless necessary.

22. Sample Data

Initially populate the website with realistic demo products so the UI can be properly evaluated.

Create sample products such as:

Banarasi Silk Saree

Designer Organza Saree

Floral Cotton Suit

Embroidered Anarkali Suit

Premium Cotton Kurta

Chanderi Silk Saree

Use placeholder images if real images are not available.

Clearly structure the code so the demo products can easily be deleted once the owner starts uploading real products.

23. Code Quality

Requirements:

TypeScript

Clean component architecture

Reusable UI components

Proper error handling

Loading states

Empty states

Form validation

Authentication checks

Secure database access

Environment variables for secrets

No hardcoded API keys

No unnecessary dependencies

Clear README

Add comments only where they are useful.

24. Deliverables

Build the complete working application, not just a static UI.

I want:

Customer-facing website

Product catalog

Product detail pages

Search

Filters

WhatsApp ordering

Instagram contact

Floating contact buttons

Admin login

Admin dashboard

Add product

Edit product

Delete product

Image upload

Category management

Availability/Sold-out management

New Arrivals

Featured products

Responsive mobile design

SEO

Database integration

Image storage

Secure authentication

Deployment-ready project

Before finishing, test the complete flow:

Admin logs in
→ uploads a product
→ product appears in catalog
→ customer opens product
→ customer clicks WhatsApp
→ WhatsApp message contains correct product information.

Make the final result feel like a real premium Indian fashion brand website, not a developer demo.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e8963134-0d12-4786-bc25-825da7542583).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
