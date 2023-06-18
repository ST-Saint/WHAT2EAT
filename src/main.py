import argparse

# Create an ArgumentParser object
parser = argparse.ArgumentParser(description='WHAT2EAT')

# Add arguments
parser.add_argument('--target', type=str, help='target website ubereats/doordash')
parser.add_argument('-a', '--age', type=int, help='Age argument')

# Parse the arguments
args = parser.parse_args()

# Access the parsed arguments
if __name__ == "__main__":
    target = args.target
    if target == "ubereats":
        import uber_eats
        uber_eats.start()
