import java.io.BufferedInputStream;
import java.util.ArrayList;

public class WAVProcessor {
	private enum Format {
		Little_Endian, 
		Big_Endian
	}
	
	private Format type;
	private int channels;
	private byte[] fmt = new byte[4];
	private byte[] sub1size = new byte[4];
	private byte[] audioFmt = new byte[2];
	private byte[] sampleRate = new byte[4];
	private byte[] bitsPerSample = new byte[2];
	private int bitsPerChunk;
	private byte[] sub2header = new byte[4];
	private byte[] sub2size = new byte[4];
	
	private int chunkCount;
	
	private BufferedInputStream buffer;
	
	private static class ChunkId {
		public final static byte[] LITTLE_ENDIAN = {
			0x52, 0x49, 0x46, 0x46
		};
		
		public final static byte[] BIG_ENDIAN = {
			0x52, 0x49, 0x46, 0x58
		};
	}
	
	private final static byte[] WAV = {
		0x57, 0x41, 0x56, 0x45
	};
	
	private final static byte[] DATA_HEADER = {
		0x64, 0x61, 0x74, 0x61
	};
	
	private boolean isLittleEndian(byte[] header){
		for(int n = 0; n < header.length; n++)
			if(header[n] != ChunkId.LITTLE_ENDIAN[n])
				return false;
		
		return true;
	}
	
	private boolean isBigEndian(byte[] header){
		for(int n = 0; n < header.length; n++)
			if(header[n] != ChunkId.BIG_ENDIAN[n])
				return false;
		
		return true;
	}
	
	private void getFormat(byte[] header) throws Exception{
		if(isLittleEndian(header)){
			this.type = Format.Little_Endian;
		}
		else if(isBigEndian(header)){
			this.type = Format.Big_Endian;
		}
		else{
			throw new Exception("No valid header provided.");
		}
	}
	
	private void checkWav(byte[] header) throws Exception{
		for(int n = 0; n < header.length; n++){
			if(header[n] != WAV[n]){
				throw new Exception("The provided file is not a WAV.");
			}
		}
	}
	
	public boolean loadWav(BufferedInputStream buffer){
		try {
			byte[] chunk = new byte[4];
			buffer.read(chunk);
			
			getFormat(chunk);
			
			buffer.skip(4);
			
			buffer.read(chunk);
			
			checkWav(chunk);
			
			buffer.read(fmt);
			buffer.read(sub1size);
			buffer.read(audioFmt);
			
			byte[] size = new byte[2];
			
			buffer.read(size);
			
			this.channels = Utilities.addBytes(size);
			
			buffer.read(sampleRate);
			
			buffer.skip(6);
			
			buffer.read(bitsPerSample);
			
			bitsPerChunk = Utilities.addBytes(bitsPerSample);
			
			/*
			 * Not PCM Skip To Data.
			 */
			
			if(Utilities.addBytes(audioFmt) != 1){
				//Read in byte size of extra data.
				buffer.read(size);
				int extra = Utilities.addBytes(size);
				
				//Skip extra bytes.
				buffer.skip(extra);
			}
			
			buffer.read(sub2header);
			
			buffer.read(sub2size);
			
			chunkCount = Utilities.addBytes(sub2size) / (channels * bitsPerChunk / 8);
			
			this.buffer = buffer;
		}
		catch(Exception e){
			e.printStackTrace();
			return false;
		}
		
		return true;
	}
	
	private byte[] createWav(byte[] bytes){
		ArrayList<Byte> constructed = new ArrayList<Byte>();
		
		/*
		 * File Type
		 */
		
		if(type == Format.Big_Endian){
			Utilities.addAllBytes(constructed, ChunkId.BIG_ENDIAN);
		}
		else if(type == Format.Little_Endian){
			Utilities.addAllBytes(constructed, ChunkId.LITTLE_ENDIAN);
		}
		
		/*
		 * Main Chunk Byte Size
		 */
		
		int chunkSize = 36 + bytes.length;
		byte[] chunkSizeByte = Utilities.intToBytes4(chunkSize);
		Utilities.addAllBytes(constructed, chunkSizeByte);
		
		/*
		 * WAVE
		 */
		
		Utilities.addAllBytes(constructed, WAV);
		
		/*
		 * fmt[]
		 */
		
		Utilities.addAllBytes(constructed, fmt);
		
		/*
		 * Sub Chunk 1 Size PCM = 16
		 */
		
		Utilities.addAllBytes(constructed, Utilities.intToBytes4(16));
		
		/*
		 * Audio Format & Number of Channels
		 */
		
		Utilities.addAllBytes(constructed, new byte[]{0x1, 0x0, 0x1, 0x0});
		
		/*
		 * Sample Rate
		 */
		
		Utilities.addAllBytes(constructed, sampleRate);
		
		/*
		 * Byte Rate
		 */
		
		int sample = Utilities.addBytes(sampleRate);
		int bits = Utilities.addBytes(bitsPerSample);
		Utilities.addAllBytes(constructed, Utilities.intToBytes4(sample * bits / 8));
		
		/*
		 * Block Align
		 */
		
		Utilities.addAllBytes(constructed, Utilities.intToBytes2(bits / 8));
		
		/*
		 * Bits per Sample
		 */
		
		Utilities.addAllBytes(constructed, bitsPerSample);
		
		/*
		 * DATA
		 */
		
		Utilities.addAllBytes(constructed, DATA_HEADER);
		
		/*
		 * Sub Chunk 2 Size (Size of data)
		 */
		
		Utilities.addAllBytes(constructed, Utilities.intToBytes4(bytes.length));
		
		/*
		 * Data
		 */
		
		Utilities.addAllBytes(constructed, bytes);
		
		byte[] finished = new byte[constructed.size()];
		
		for(int n = 0; n < constructed.size(); n++){
			finished[n] = constructed.get(n);
		}
		
		return finished;
	}
	
	public byte[][] deinterleave() throws Exception{
		byte[][] channels = new byte[this.channels][chunkCount * bitsPerChunk / 8];
		int bytesPerChunk = bitsPerChunk / 8;
		
		for(int n = 0; n < this.chunkCount; n++){
			for(int k = 0; k < this.channels; k++){
				for(int g = 0; g < bytesPerChunk; g++){
					channels[k][n * bytesPerChunk + g] = (byte) buffer.read();
				}
			}
		}
		
		for(int n = 0; n < channels.length; n++){
			channels[n] = createWav(channels[n]);
		}
		
		return channels;
	}
	
	public String toString(){
		String ret = "WAVProcessor\n";
		ret += "Type: " + this.type + "\n";
		ret += "Channels: " + this.channels + "\n";
		ret += "Bits per Chunk: " + this.bitsPerChunk + "\n";
		ret += "Audio Format: " + Utilities.addBytes(audioFmt) + "\n";
		
		return ret;
	}
}