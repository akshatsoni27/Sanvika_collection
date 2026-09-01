-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Bootstrap: first authenticated user may claim admin when no admin exists yet
CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing int;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  SELECT count(*) INTO existing FROM public.user_roles WHERE role = 'admin';
  IF existing > 0 THEN RETURN public.has_role(auth.uid(), 'admin'); END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin')
    ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

-- CATEGORIES
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sku text NOT NULL UNIQUE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  discount_price numeric(10,2),
  description text,
  fabric text,
  color text,
  sizes text[] NOT NULL DEFAULT '{}',
  available boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  new_arrival boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are public" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PRODUCT IMAGES
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX product_images_product_idx ON public.product_images(product_id);
GRANT SELECT ON public.product_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product images are public" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins manage product images" ON public.product_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- DEMO DATA (safe to delete once real products are added)
INSERT INTO public.categories (name, slug, display_order) VALUES
  ('Sarees','sarees',1),('Suits','suits',2),('Kurtas','kurtas',3),
  ('Lehengas','lehengas',4),('Dupattas','dupattas',5),('Other','other',6);

INSERT INTO public.products (product_name, slug, sku, category_id, price, discount_price, description, fabric, color, sizes, available, featured, new_arrival, created_at) VALUES
 ('Banarasi Silk Saree','banarasi-silk-saree-sc-101','SC-101',(SELECT id FROM public.categories WHERE slug='sarees'),4999,4299,'A handwoven Banarasi silk saree with intricate gold zari motifs, finished with a rich contrast border. Comes with an unstitched blouse piece.','Pure Banarasi Silk','Deep Maroon','{"Free Size"}',true,true,true, now() - interval '1 day'),
 ('Designer Organza Saree','designer-organza-saree-sc-102','SC-102',(SELECT id FROM public.categories WHERE slug='sarees'),3299,NULL,'Featherlight organza saree with hand-painted florals and a delicate sequin border. Perfect for daytime celebrations.','Organza','Blush Ivory','{"Free Size"}',true,true,true, now() - interval '2 days'),
 ('Chanderi Silk Saree','chanderi-silk-saree-sc-103','SC-103',(SELECT id FROM public.categories WHERE slug='sarees'),2499,NULL,'Classic Chanderi weave with subtle butti work throughout and a woven gold pallu.','Chanderi Silk','Sage Green','{"Free Size"}',false,false,false, now() - interval '9 days'),
 ('Floral Cotton Suit','floral-cotton-suit-sc-201','SC-201',(SELECT id FROM public.categories WHERE slug='suits'),1899,1599,'Breathable cotton suit set with all-over floral print, straight pants and a matching mulmul dupatta.','Cotton','Powder Blue','{"S","M","L","XL"}',true,false,true, now() - interval '3 days'),
 ('Embroidered Anarkali Suit','embroidered-anarkali-suit-sc-202','SC-202',(SELECT id FROM public.categories WHERE slug='suits'),5499,NULL,'Floor-length Anarkali in georgette with thread and sequin embroidery on the yoke, paired with a scalloped dupatta.','Georgette','Wine','{"S","M","L","XL"}',true,true,false, now() - interval '12 days'),
 ('Premium Cotton Kurta','premium-cotton-kurta-sc-301','SC-301',(SELECT id FROM public.categories WHERE slug='kurtas'),999,849,'Everyday luxury kurta in soft handloom cotton with a fine chikankari neckline.','Handloom Cotton','Ivory','{"S","M","L","XL","XXL"}',true,false,true, now() - interval '4 days');

INSERT INTO public.product_images (product_id, image_url, display_order)
SELECT id, '/images/demo/' || sku || '.jpg', 0 FROM public.products;
INSERT INTO public.product_images (product_id, image_url, display_order)
SELECT id, '/images/demo/' || sku || '-b.jpg', 1 FROM public.products;