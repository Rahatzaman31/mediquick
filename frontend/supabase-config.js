import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://dmnypeqqgoaydaakibwh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtbnlwZXFxZ29heWRhYWtpYndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1Mzg2NzksImV4cCI6MjA3NTExNDY3OX0.zs8NBeiP5f2aJw32JCY3CUIiqQWsRzu3PsQlZSBAgzM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.supabase = supabase;
