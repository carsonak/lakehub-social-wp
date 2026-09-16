<?php
/**
 * Update About page (post 146) with canonical Our Story copy from about_page.docx
 */

require_once __DIR__ . '/../wp-load.php';

$post = get_post( 146 );
if ( ! $post ) {
	echo "Post 146 not found\n";
	exit( 1 );
}

$old_story = '<!-- wp:paragraph -->
<p>Founded in May 2013 by co-founder James Odede and a group of students and young professionals, LakeHub emerged to empower tech talent in Western Kenya. By 2014, it opened its first physical space in Kisumu, making it the first tech innovation hub in Kenya located outside Nairobi. In 2017, the organization formalised its impact by registering as the non-profit LakeHub Foundation, shifting focus heavily toward digital literacy, tech hackathons, and structured incubation programs. A major milestone arrived in 2020 when they graduated 200 female developers through their FemiDev program in partnership with UNDP Kenya. This success eventually paved the way for a partnership with 01Talent to establish a world-class, tuition-free software engineering apprenticeship in Kisumu</p>
<!-- /wp:paragraph -->';

$new_story = '<!-- wp:group {"className":"is-style-lakehub-story-copy","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-story-copy">
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Rooted in Kisumu, Building for the World</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>LakeHub began in Kisumu with a simple belief: talent is equally distributed, but opportunities are not. Across Western Kenya, talented young people had limited access to modern technology training, mentorship, professional networks, and opportunities within the digital economy. Traditional training often struggled to keep pace with industry needs, while the region lacked the connections and infrastructure needed to turn local talent into sustainable careers.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>What started as a small initiative to bring tech enthusiasts together through informal meetups, knowledge sharing, and connections to mentors in Nairobi grew into a structured technology ecosystem. LakeHub began building the infrastructure, programs, partnerships, and community needed to make high-quality tech education and opportunity accessible from Kisumu.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>As the ecosystem grew, LakeHub expanded into structured bootcamps and technical programs before integrating Zone01, bringing an intensive, industry-oriented software engineering pathway directly to Kisumu. This created a stronger talent pipeline while giving young people from the region access to the skills, networks, and opportunities needed to compete beyond their geography.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>But training was only the beginning. As more apprentices graduated, a new challenge emerged: what happens to the talent after graduation? LakeHub needed a way to stay connected to its alumni, understand where they go, track their progress, and continue connecting them to opportunities and mentors.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>This led to LakeHub Social — a digital layer connecting apprentices, alumni, and mentors beyond the classroom. It transforms LakeHub from a place where people learn into an ecosystem where relationships, opportunities, and impact continue to grow long after graduation.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>From a local tech community in Kisumu to a connected ecosystem building talent for the world, LakeHub continues to close the gap between talent and opportunity.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->';

$content = str_replace( $old_story, $new_story, $post->post_content );
wp_update_post( array(
	'ID'           => 146,
	'post_content' => $content,
) );

echo "Successfully updated Post 146 (About) Our Story section.\n";
