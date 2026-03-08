import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { Readable } from 'stream';

const supabaseUrl = 'https://ollnssdpdevcumwxbkuw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbG5zc2RwZGV2Y3Vtd3hia3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDM3NjcsImV4cCI6MjA4ODM3OTc2N30.VdN_lTH-O5x-9we9-bxlYKK8twGBhTt8ARSFf4A_Cto';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    console.log("Fetching lesson video url...");
    const { data: lessons, error: dbError } = await supabase
        .from('lessons')
        .select('id, video_url')
        .eq('track', 'dutch')
        .eq('order_index', 1)
        .limit(1);

    if (dbError || !lessons || lessons.length === 0) {
        console.error("Error fetching lesson:", dbError);
        return;
    }

    const lesson = lessons[0];
    const sourceUrl = lesson.video_url;

    if (!sourceUrl || sourceUrl.includes('lesson-videos')) {
        console.log("Video URL already points to lesson-videos or is empty.", sourceUrl);
        return;
    }

    console.log("Downloading video from:", sourceUrl);
    const response = await fetch(sourceUrl);
    if (!response.ok) {
        console.error("Failed to fetch video:", response.statusText);
        return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Uploading video to Supabase Storage...");
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lesson-videos')
        .upload('U1-L1-me-llamo.mp4', buffer, {
            contentType: 'video/mp4',
            upsert: true
        });

    if (uploadError) {
        console.error("Error uploading video:", uploadError);
        return;
    }

    console.log("Getting public URL...");
    const { data: publicUrlData } = supabase.storage
        .from('lesson-videos')
        .getPublicUrl('U1-L1-me-llamo.mp4');

    const publicUrl = publicUrlData.publicUrl;
    console.log("Public URL:", publicUrl);

    console.log("Updating lesson in database...");
    const { error: updateError } = await supabase
        .from('lessons')
        .update({ video_url: publicUrl })
        .eq('id', lesson.id);

    if (updateError) {
        console.error("Error updating lesson:", updateError);
        return;
    }

    console.log("Successfully fixed video for lesson!");
}

main().catch(console.error);
