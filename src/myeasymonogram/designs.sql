SELECT JSON_ARRAYAGG(
	JSON_OBJECT(
    'id', mrp.id,
    'title', mrp.title,
    'product_type', mrp.product_type,
    'store_product_id', mrp.store_product_id,
    'duplicate_unique_id', mrp.duplicate_unique_id,
    'store', (
      SELECT JSON_OBJECT(
        'email', usr.email,
        'name', usr.first_name
      ) FROM users AS usr WHERE usr.store_id = mrp.store_id
    ),
    'design_elements', (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', merchd.id,
          'duplicate_unique_id', merchd.duplicate_unique_id,
          'is_required', merchd.is_required,
          'is_master_required', merchd.is_master_required,
          'image_url', merchd.image_url,
          'is_deleted', merchd.is_deleted,
          'master_design', (
            SELECT JSON_OBJECT(
              'name', masd.name,
              'type', masd.type,
              'description', masd.description,
              'is_required', masd.is_required,
              'height', masd.height,
              'width', masd.width,
              'resolution', masd.resolution,
              'image_url', masd.image_url
            ) FROM master_design AS masd 
            WHERE masd.id = merchd.master_design_id
          )
        ) 
      ) FROM merchant_design AS merchd WHERE merchd.duplicate_unique_id = mrp.duplicate_unique_id
    ) 
  )
) FROM merchant_products AS mrp
WHERE mrp.duplicate_unique_id IS NOT NULL AND mrp.store_product_id IS NOT NULL