import bcrypt from "bcrypt"

export async function ComparePassword(plain: string, encrypted: string) {
    const match = await bcrypt.compare(plain, encrypted)
    return match;
}
