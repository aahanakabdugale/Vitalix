from supabase import create_client, Client

# Hardcoded for testing - replace with your actual values from Supabase
URL = "https://pkdpsjztbwdklmlmwabm.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZHBzanp0Yndka2xtbG13YWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTY1OTksImV4cCI6MjA5NjczMjU5OX0.nPPzcEgZ3UWLCJM1s5DzUrtuqw8BUkxpFXZQh5hgArc"

# Initialize the client directly
supabase: Client = create_client(URL, KEY)