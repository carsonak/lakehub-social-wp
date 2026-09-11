<?php
/**
 * Title: Home · Latest Insights
 * Slug: lakehub-social/home-insights
 * Categories: lakehub
 * Description: Editable Figma-based LakeHub layout.
 */
?>
<!-- wp:group {"tagName":"section","templateLock":"all","metadata":{"name":"Home · Latest Insights"},"align":"full","className":"is-style-lakehub-insights","gradient":"insights","layout":{"type":"default"},"anchor":"stories"} -->
<section class="wp-block-group alignfull is-style-lakehub-insights has-insights-gradient-background has-background" id="stories"><!-- wp:group {"className":"is-style-lakehub-impact-heading","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-impact-heading"><!-- wp:heading {"fontSize":"section"} -->
<h2 class="wp-block-heading has-section-font-size">Latest Insights</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"body","fontSize":"lead"} -->
<p class="has-body-color has-text-color has-lead-font-size">Stories of innovation and community progress.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:query {"queryId":1,"query":{"perPage":12,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[1],"sticky":"ignore","inherit":false},"className":"is-style-lakehub-insights"} -->
<div class="wp-block-query is-style-lakehub-insights"><!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:group {"className":"is-style-lakehub-insight-card","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-insight-card"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"1.888"} /-->

<!-- wp:group {"className":"is-style-lakehub-insight-copy","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-insight-copy"><!-- wp:post-title {"level":3,"isLink":true,"fontSize":"lead"} /-->

<!-- wp:post-excerpt {"showMoreOnNewLine":false,"excerptLength":32} /-->

<!-- wp:read-more {"content":"→"} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>Stories will appear here when they are published.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query --></section>
<!-- /wp:group -->
